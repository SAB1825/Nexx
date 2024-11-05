import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { DATABASE_ID, PROJECT_ID, WORKSPACE_ID } from "@/config";
import { Project } from "./types";

interface getProjectProps {
    projectId: string;
}
export const getProject = async ({projectId }: getProjectProps) => {
        const {database, account} = await createSessionClient();

        const user = await account.get();
        const project = await database.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)
        const member = await getMember({
            database,
            userId : user.$id,
            workspaceId : project.workspaceId
        })
        if(!member) {
            throw new Error("Member not found")
        }
        return project
    
}