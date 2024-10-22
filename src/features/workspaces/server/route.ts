import { zValidator } from '@hono/zod-validator';
import { Hono } from "hono";
import { UpdateWorkspaceSchema, WorkspaceSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { MemberRole } from '@/features/members/types';
import { generateInviteCode } from '@/lib/utils';
import { getMember } from '@/features/members/utils';

import { z } from 'zod';
import { Workspace } from '../types';


const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const database = c.get("database");
        const user = c.get("user");

        const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)])
        if(members.total === 0) {
            return c.json({data :{ documents: [], total: 0 }})
        }
        const workspaceId = members.documents.map((member) => member.workspaceId)
        const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACE_ID,[ 
            Query.orderDesc("$createdAt"),
            Query.equal("$id",workspaceId)])
        return c.json({ success: true, data: workspaces })
    })
    .post(
        "/",
        zValidator("form", WorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const database = c.get("database");
            const storage = c.get("storage");
            const { name, image } = c.req.valid("form");

            let UploadedImageUrl: string | undefined;
            if (image instanceof File) {
                const uploadedImage = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )

                const arrayBuffer = await storage.getFilePreview(
                
                    IMAGES_BUCKET_ID,
                    uploadedImage.$id
                )

                UploadedImageUrl = `data:images/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            }
            const user = c.get("user");
            const workspace = await database.createDocument(DATABASE_ID, WORKSPACE_ID, ID.unique(), {
                name,
                userId: user.$id,
                imageUrl : UploadedImageUrl,
                inviteCode: generateInviteCode(6)
            })

            await database.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
                userId: user.$id,
                workspaceId: workspace.$id,
                role: MemberRole.ADMIN
            })

            return c.json({ success: true, data: workspace })
        }
    )
    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", UpdateWorkspaceSchema),
        async (c) => {
            const database = c.get("database");
            const storage = c.get("storage");
            const user = c.get("user");
            const { workspaceId } = c.req.param();
            const { name, image } = c.req.valid("form");
            const member = await getMember({
                database, 
                workspaceId, 
                userId: user.$id
            })
            if(!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to update this workspace"}, 401)
            }
            let UploadedImageUrl: string | undefined;
            if (image instanceof File) {
                const uploadedImage = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                )

                const arrayBuffer = await storage.getFilePreview(
                
                    IMAGES_BUCKET_ID,
                    uploadedImage.$id
                )

                UploadedImageUrl = `data:images/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            }else{
                UploadedImageUrl  = image;
            }
            const workspace = await database.updateDocument(DATABASE_ID, WORKSPACE_ID, workspaceId, {
                name,
                imageUrl: UploadedImageUrl
            })
            return c.json({ data: workspace })
        }
    )
    .delete(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const database = c.get("database");
            const user = c.get("user");

            const { workspaceId } = c.req.param();
            const member = await getMember({
                database,
                workspaceId,
                userId: user.$id
            })
            if(!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to delete this workspace"}, 401)
            }

            await database.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId)
            return c.json({ data: { $id: workspaceId }})
        }
    )
    .post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            const database = c.get("database");
            const user = c.get("user");

            const { workspaceId } = c.req.param();
            const member = await getMember({
                database,
                workspaceId,
                userId: user.$id
            })
            if(!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to delete this workspace"}, 401)
            }

            const workspace = await database.updateDocument(DATABASE_ID, WORKSPACE_ID, workspaceId, 
                { 
                    inviteCode : generateInviteCode(6)
                })
            return c.json({ data: workspace})
        }
    )
    .post(
        "/:workspaceId/join",
        sessionMiddleware,
        zValidator("json", z.object({ code: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.param();
            const { code } = c.req.valid("json");

            const databases = c.get("database");
            const user = c.get("user");

            const member = await getMember({
                database: databases,
                workspaceId,
                userId: user.$id
            })

            if(member) {
                return c.json({ error: "You are already a member of this workspace"}, 400)
            }

            const workspace =  await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACE_ID,
                workspaceId
            )

            if(workspace.inviteCode !== code) {
                return c.json({ error: "Invalid invite code"}, 400)
            }

            await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
                workspaceId,
                userId: user.$id,
                role: MemberRole.MEMBER
            })
            return c.json({ data: workspace})

        }
    )
export default app;