import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>


export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({json}) => {
            const response = await client.api.auth.login["$post"]({ json });
            if(!response.ok) {
                throw new Error("Failed to login")
            }
            return await response.json()
        },
        onSuccess: () => {
            toast.success("Logged in successfully")
            router.refresh()
            queryClient.invalidateQueries({queryKey: ["current"]})
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Password or email is incorrect")
        }
    })
    return mutation

}