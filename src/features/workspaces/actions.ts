"use server"

import { Query } from "node-appwrite"
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from "@/config"
import { getMember } from "../members/utils"
import { Workspace } from "./types"
import { createSessionClient } from "@/lib/appwrite"

export const getWorkspace = async () => {
    try {
        const {database, account} = await createSessionClient();
        const user = await account.get();
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

interface getWorkspaceProps {
    workspaceId: string;
}
export const getWorkspaces = async ({workspaceId }: getWorkspaceProps) => {
    try {
        const {database, account} = await createSessionClient();

        const user = await account.get();
        const member = await getMember({
            database,
            userId : user.$id,
            workspaceId
        })
        if(!member) {
            return null
        }
        // Directly fetch the workspace document using the workspaceId
        const workspace = await database.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
        return workspace
    } catch (error) {
        console.log(error)
        return null
    }
}
