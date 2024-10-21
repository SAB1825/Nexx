import  auth  from '@/features/auth/server/route';
import { handle } from 'hono/vercel';
import { Hono } from "hono";
import  workspaces  from "@/features/workspaces/server/route";
const app = new Hono().basePath("/api");

const routes = app
    .route("/auth", auth)
    .route("/workspaces", workspaces)


export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export type AppType = typeof routes;
