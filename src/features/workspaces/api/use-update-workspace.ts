import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;


export const useUpdateWorkspace = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form ,param}) => {
            const response = await client.api.workspaces[":workspaceId"]["$patch"]({ form , param});
            if(!response.ok) {
                throw new Error("Failed to update workspace")
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            router.refresh()
            toast.success("Workspace Updated Successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            queryClient.invalidateQueries({queryKey: ["workspaces", data.$id]})
        },
        onError: () => {
            toast.error("Failed to Update workspace, Check the file size or format.")
            
        }
    })
    return mutation
}
