import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.projects["$post"]>


export const useCreateProject = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form}) => {
            const response = await client.api.projects["$post"]({ form });
            if(!response.ok) {
                throw new Error("Failed to Create Project")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Project created successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Failed to create Project, Check the file size and format.")
            
        }
    })
    return mutation
}