import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";


const workspaceIdPage = async () => {
    const user = await getCurrent();
    if(!user) {
        redirect("/sign-in")
    }
    return <div>workspaceIdPage</div>
}

export default workspaceIdPage;