"use server"

import { cookies } from "next/headers"
import { Account, Client, Databases, Query } from "node-appwrite"
import { AUTH_COOKIE } from "@/features/auth/constant"
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config"

export const getWorkspace = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        
        const session = cookies().get(AUTH_COOKIE);
        if(!session) {
            console.log("No session cookie found")
            return { documents: [], total: 0 }
        }

        // Set the session token for the client
        client.setSession(session.value);
        const account = new Account(client);
        const user = await account.get();
        const database = new Databases(client);
        const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal("userId", user.$id)])
        if(members.total === 0) {
            return { documents: [], total: 0 }
        }
        const workspaceId = members.documents.map((member) => member.workspaceId)
        const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACE_ID,[ 
            Query.orderDesc("$createdAt"),
            Query.equal("$id",workspaceId)])
        return workspaces
    } catch (error) {
        console.log(error)
        return { documents: [], total: 0 }

    }
}
