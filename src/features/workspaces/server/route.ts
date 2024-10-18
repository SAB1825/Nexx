import { zValidator } from '@hono/zod-validator';
import { POST } from './../../../app/api/[[...route]]/route';
import { Hono } from "hono";
import { WorkspaceSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middleware';
import { DATABASE_ID, WORKSPACE_ID } from '@/config';
import { ID } from 'node-appwrite';


const app = new Hono()
    .post(
        "/",
        zValidator("json", WorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const database = c.get("database");
            const { name } = c.req.valid("json");
            const user = c.get("user");
            const workspace = await database.createDocument(DATABASE_ID, WORKSPACE_ID, ID.unique(), {
                name,
                userId: user.$id
            })

            return c.json({ success: true, data: workspace })
        }
    )
export default app;