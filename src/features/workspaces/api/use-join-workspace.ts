import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>


export const useJoinWorkspace = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({param, json}) => {
            const response = await client.api.workspaces[":workspaceId"]["join"]["$post"]({ param, json });
            if(!response.ok) {
                throw new Error("Failed to join")
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success("Joined workspace successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspace", data.$id]})
        },
        onError: () => {
            toast.error("Failed to join workspace")
            
        }
    })
    return mutation
}
