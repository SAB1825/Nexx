import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>


export const useUpdateTask = (): UseMutationResult<ResponseType, Error, RequestType> => {
    const router = useRouter()
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({json, param}) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param });
            if(!response.ok) {
                throw new Error("Failed to Update Task")
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success("Task Updated successfully")
            queryClient.invalidateQueries({queryKey: ["tasks"]})
            queryClient.invalidateQueries({queryKey: ["tasks", data.$id]})
            router.refresh()
        },
        onError: () => {
            toast.error("Failed to Update Task.")
            
        }
    })
    return mutation
}
