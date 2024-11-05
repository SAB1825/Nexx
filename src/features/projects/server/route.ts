import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECT_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, UpdateProjectSchema } from "../schemas";
import { Project } from "../types";

const app = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("form", createProjectSchema),
        async (c) => {
            const database = c.get("database");
            const storage = c.get("storage");
            const user = c.get("user");
            const { name, image, workspaceId } = c.req.valid("form");
            const member = await getMember({
                database,
                workspaceId,
                userId: user?.$id
            })
            if(!member) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
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
            }
            const project = await database.createDocument(DATABASE_ID, PROJECT_ID, ID.unique(), {
                name,
                imageUrl : UploadedImageUrl,
                workspaceId
            })

            

            return c.json({ success: true, data: project })
        }
    )
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get("user")
            const database = c.get("database")

            const { workspaceId } = c.req.valid("query")

            if(!workspaceId) {
                return c.json({
                    error: "Workspace ID is required"
                }, 400)
            }

            const member = await getMember({
                database,
                workspaceId,
                userId: user?.$id
            })

            if(!member) {
                return c.json({
                    error: "Unauthorized"
                }, 401)
            }

            const projects = await database.listDocuments(
                DATABASE_ID,
                PROJECT_ID,
                [
                    Query.equal("workspaceId", workspaceId),
                    Query.orderDesc("$createdAt")
                ]
            )

            return c.json({ data: projects })
        }
    )
    .patch(
        "/:projectId",
        sessionMiddleware,
        zValidator("form", UpdateProjectSchema),
        async (c) => {
            const database = c.get("database");
            const storage = c.get("storage");
            const user = c.get("user");
            const { projectId } = c.req.param();
            const { name, image } = c.req.valid("form");

            const existingProject  = await database.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)
            const member = await getMember({
                database, 
                workspaceId : existingProject.workspaceId, 
                userId: user.$id
            })
            if(!member) {
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
            const project = await database.updateDocument(DATABASE_ID, PROJECT_ID, projectId, {
                name,
                imageUrl: UploadedImageUrl
            })
            return c.json({ data: project })
        }
    )
    .delete(
        "/:projectId",
        sessionMiddleware,
        async (c) => {
            const database = c.get("database");
            const user = c.get("user");

            const { projectId } = c.req.param();
            const existingProject  = await database.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)

            const member = await getMember({
                database,
                workspaceId : existingProject.workspaceId,
                userId: user.$id
            })
            if(!member) {
                return c.json({ error: "You are not authorized to delete this project"}, 401)
            }

            await database.deleteDocument(DATABASE_ID, PROJECT_ID, projectId)
            return c.json({ data: { $id: existingProject.projectId }})
        }
    )
    .get(
        "/:projectId",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const database = c.get("database");
            const user = c.get("user");
            const { projectId } = c.req.param();
            const { workspaceId } = c.req.valid("query");

            if (!workspaceId) {
                return c.json({
                    error: "Workspace ID is required"
                }, 400);
            }

            const member = await getMember({
                database,
                workspaceId,
                userId: user?.$id
            });

            if (!member) {
                return c.json({
                    error: "Unauthorized"
                }, 401);
            }

            try {
                const project = await database.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId);
                
                if (project.workspaceId !== workspaceId) {
                    return c.json({
                        error: "Project does not belong to the specified workspace"
                    }, 403);
                }

                return c.json({ data: project });
            } catch (error) {
                console.error("Error fetching project:", error);
                return c.json({
                    error: "Project not found"
                }, 404);
            }
        }
    )

export default app
