import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>


export const useCreateWorkspace = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form}) => {
            const response = await client.api.workspaces["$post"]({ form });
            if(!response.ok) {
                throw new Error("Failed to Create Workspace")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Workspace created successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Failed to create workspace, Check the file size and format.")
            
        }
    })
    return mutation
}
