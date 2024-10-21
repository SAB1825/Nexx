import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface GetMemberProps {
    database: Databases;
    workspaceId: string;
    userId: string;
}

export const getMember = async ({database, workspaceId, userId}: GetMemberProps) => {
    const member = await database.listDocuments(
        DATABASE_ID, 
        WORKSPACE_ID,
        [
        Query.equal("userId", userId),
        Query.equal("workspaceId", workspaceId)
    ]
)

    return member.documents[0];
}
