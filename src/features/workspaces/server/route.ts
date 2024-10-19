import { zValidator } from '@hono/zod-validator';
import { POST } from './../../../app/api/[[...route]]/route';
import { Hono } from "hono";
import { WorkspaceSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACE_ID } from '@/config';
import { ID } from 'node-appwrite';


const app = new Hono()
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
                imageUrl : UploadedImageUrl
            })

            return c.json({ success: true, data: workspace })
        }
    )
export default app;