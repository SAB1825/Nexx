import { getCurrent } from "@/features/auth/actions"
import { getWorkspaceInfo } from "@/features/workspaces/actions";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { redirect } from "next/navigation"

interface WorkspaceJoinPageProps {
    params: {
        workspaceId: string;
        inviteCode: string;
    }
}

const WorkspaceJoinPage = async ({ params }: WorkspaceJoinPageProps) => {
    const user = await getCurrent()
    if(!user) { 
        return redirect("/sign-in")
    }

    const workspaceInfo = await getWorkspaceInfo({
        workspaceId: params.workspaceId
    })
    if(!workspaceInfo) {
        return redirect("/")
    }
    return (<div>
        <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>)
}

export default WorkspaceJoinPage