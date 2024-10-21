import { getCurrent } from "@/features/auth/actions";
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

    return <div>
        workspaceIdSettings: {params.workspaceId}

    </div>
}

export default workspaceIdSettingsPage;