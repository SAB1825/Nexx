import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps { 
    taskId: string;
}
export const useGetTask = ({taskId}: UseGetTasksProps) => {
    const query = useQuery({
        queryKey: ["task", taskId], 
        queryFn: async () => {
            try {
                const response = await client.api.tasks[":taskId"].$get({
                  param: {
                    taskId
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





