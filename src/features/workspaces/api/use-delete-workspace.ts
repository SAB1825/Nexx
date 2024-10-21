import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$delete"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$delete"]>


export const useDeleteWorkspace = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({param}) => {
            const response = await client.api.workspaces[":workspaceId"]["$delete"]({ param });
            if(!response.ok) {
                throw new Error("Failed to Create Workspace")
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success("Workspace deleted successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete workspace")
            
        }
    })
    return mutation
}
