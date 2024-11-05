import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjectsProps { 
    workspaceId: string
}
export const useGetProjects = ({workspaceId}: UseGetProjectsProps) => {
    const query = useQuery({
        queryKey: ["projects", workspaceId],
        queryFn: async () => {
            try {
                const response = await client.api.projects.$get({
                    query: {
                        workspaceId
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { data } = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching projects:", error);
                return null;
            }
        },
        
    });
    return query;
};
interface UseGetProjectProps {
    workspaceId: string;
    projectId: string;
  }
  
  export const useGetProject = ({ workspaceId, projectId }: UseGetProjectProps) => {
    return useQuery({
      queryKey: ["project", workspaceId, projectId],
      queryFn: async () => {
        try {
            const response = await client.api.projects[":projectId"].$get({
                query: {
                  workspaceId
                },
                param: {
                  projectId
                }
              });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching project:", error);
          return null;
        }
      },
      enabled: !!workspaceId && !!projectId
    });
  };





