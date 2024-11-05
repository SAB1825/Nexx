"use client"
import { UserButton } from "@/features/auth/components/UserButton"
import { MobileSidebar } from "./mobile-navbar"
import { useParams } from 'next/navigation'
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useMemo } from "react"
import { useGetProject, useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"

export const Navbar = () => {
  const { data: workspaces } = useGetWorkspaces();
  const params = useParams();
  const workspaceId = useWorkspaceId();
  const { data: currentProject } = useGetProject({
    workspaceId,
    projectId: params.projectId as string
  });

  const currentWorkspaceName = useMemo(() => {
    if (!workspaces?.documents || !params.workspaceId) return '';

    const currentWorkspace = workspaces.documents.find(w => w.$id === params.workspaceId);
    return currentWorkspace?.name || '';
  }, [workspaces, params.workspaceId]);

  const currentProjectName = currentProject?.data.name
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-transparent  z-10 lg:left-[264px]">
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto px-4">
        <MobileSidebar />
        <p className="text-white text-2xl hidden sm:block">
          {currentWorkspaceName}
          {currentProjectName && ` / ${currentProjectName}`}
        </p>
        <UserButton />
      </div>
    </div>
  )
}
