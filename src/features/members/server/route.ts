import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { MemberRole } from "../types";


const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { users } = await createAdminClient()
            const database = c.get("database");
            const user = c.get("user")
            const { workspaceId } = c.req.valid("query")

            const member = await getMember({
                database,
                workspaceId,
                userId: user?.$id
            })

            if(!member) {
                return c.json({
                    error: "No members found"
                }, 404)
            }

            const members = await database.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", workspaceId)]
            )

            const populatedMembers = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId)
                    return {
                        ...member,
                        name: user?.name,
                        email: user?.email,      
                        role: member.role
                    }
                })
            )

            return c.json({
                data: {
                    ...members,
                    documents: populatedMembers
                }
            })
        }
    )  
    .delete(
        "/:memberId",
        sessionMiddleware,
        async (c) => {
            const { memberId } = c.req.param();
            const user = c.get("user")
            const database = c.get("database")

            const memberToDelete = await database.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId
            )
            const allMemberInWorkspace = await database.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToDelete.workspaceId)]
            )
            if(allMemberInWorkspace.documents.length === 1) {
                return c.json({
                    error: "Cannot delete last member in workspace"
                }, 400)
            }
            const member = await getMember({
                database,
                workspaceId: memberToDelete.workspaceId,
                userId: user?.$id
            })
            if(!member) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
            }
            if(member.id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
            }

            await database.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId)

            return c.json({
                data: { $id: memberToDelete.$id }
            })
        }
    )
    .patch(
        "/:memberId",
        sessionMiddleware,
        zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
        async (c) => {
            const { memberId } = c.req.param();
            const user = c.get("user")
            const database = c.get("database")
            const { role } = c.req.valid("json")
            const memberToUpdate = await database.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
            )
            const allMemberInWorkspace = await database.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
            )
            const member = await getMember({
                database,
                workspaceId: memberToUpdate.workspaceId,
                userId: user?.$id
            })
            if(allMemberInWorkspace.documents.length === 1) {
                return c.json({
                    error: "Cannot downgrade last member in workspace"
                }, 400)
            }
            if(!member) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
            }
            if(member.id !== memberToUpdate.$id && member.role !== MemberRole.ADMIN) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
            }
            
            await database.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
                role
            })

            return c.json({
                data: { $id: memberToUpdate.$id }
            })
        }
    )  
export default app