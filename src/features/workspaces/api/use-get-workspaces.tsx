import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";


export const useGetWorkspaces = () => {
    const query = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            try {
                const response = await client.api.workspaces.$get();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { data } = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching current user:", error);
                return null;
            }
        },
        retry: false, 
    });
    return query;
};


