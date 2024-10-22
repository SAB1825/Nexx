import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetMembersProps {
    workspaceId: string;
}

export const useGetMembers = ({workspaceId}: UseGetMembersProps) => {
    const query = useQuery({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            try {
                const response = await client.api.members.$get({ query: { workspaceId } });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { data } = await response.json();
                return { data };
            } catch (error) {
                console.error("Error fetching members:", error);
                return null;
            }
        },
        retry: false, 
    });
    return query;
};


