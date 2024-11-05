import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>


export const useUpdateProject = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form, param}) => {
            const response = await client.api.projects[":projectId"]["$patch"]({ form, param });
            if(!response.ok) {
                throw new Error("Failed to Update Project")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Project Update successfully")
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
            router.refresh()
        },
        onError: () => {
            toast.error("Failed to Update Project, Check the file size and format.")
            
        }
    })
    return mutation
}
