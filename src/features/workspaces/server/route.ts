import { zValidator } from '@hono/zod-validator';
import { POST } from './../../../app/api/[[...route]]/route';
import { Hono } from "hono";
import { WorkspaceSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config';
import { ID, Query } from 'node-appwrite';
import { MemberRole } from '@/features/members/types';
import { generateInviteCode } from '@/lib/utils';


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
export default app;