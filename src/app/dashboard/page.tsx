
import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();
  console.log({user})
  if(!user) {
    
    redirect("/sign-in")     

  }

  const workspaces = await getWorkspace();
  if(workspaces.total === 0) {
    redirect("/dashboard/workspaces/create-workspace")
  }else{
    redirect(`/dashboard/workspaces/${workspaces.documents[0].$id}`)
  }

  return (
    <div >
      Home page
    </div>
  );
}
