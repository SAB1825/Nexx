import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface UseGetTasksProps { 
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    assignedId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}
export const useGetTasks = ({workspaceId, projectId, status, assignedId, dueDate, search}: UseGetTasksProps) => {
    const query = useQuery({
        queryKey: ["tasks", workspaceId, projectId, status, assignedId, dueDate, search], 
        queryFn: async () => {
            try {
                const response = await client.api.tasks.$get({
                    query: {
                        workspaceId,
                        projectId : projectId ?? undefined,
                        status: status ?? undefined,
                        assignedId: assignedId ?? undefined,
                        dueDate: dueDate ?? undefined,
                        search: search ?? undefined
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





