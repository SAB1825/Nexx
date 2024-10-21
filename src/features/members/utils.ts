import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface GetMemberProps {
    database: Databases;
    workspaceId: string;
    userId: string;
}

export const getMember = async ({database, workspaceId, userId}: GetMemberProps) => {
    const members = await database.listDocuments(
        DATABASE_ID, 
        MEMBERS_ID,
        [
            Query.equal("userId", userId),
            Query.equal("workspaceId", workspaceId)
        ]
    )

    return members.documents[0];
}
