import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string;
    }
}
const workspaceIdSettingsPage = async({ params }: WorkspaceIdSettingsPageProps) => {
    const user = await getCurrent();
    if(!user) {
        redirect("/sign-in");
    }
    const initialValues = await getWorkspaces({
        workspaceId: params.workspaceId
    })
    console.log(initialValues);
    if(!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`)
    }

    return (
    <div className="mt-10">
        <EditWorkspaceForm initialValues={initialValues} />

    </div>
    )
}

export default workspaceIdSettingsPage;