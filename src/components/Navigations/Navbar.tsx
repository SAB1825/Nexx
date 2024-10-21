"use client"
import { UserButton } from "@/features/auth/components/UserButton"
import { MobileSidebar } from "./mobile-navbar"
import { useParams } from 'next/navigation'
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { useMemo } from "react"

export const Navbar = () => {
  const { data: workspaces } = useGetWorkspaces();
  const params = useParams();

  const currentWorkspaceName = useMemo(() => {
    if (!workspaces?.documents || !params.workspaceId) return '';

    const currentWorkspace = workspaces.documents.find(w => w.$id === params.workspaceId);
    return currentWorkspace?.name || '';
  }, [workspaces, params.workspaceId]);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-zinc-700 z-10 lg:left-[264px]">
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto px-4">
        <MobileSidebar />
        <p className="text-white text-2xl hidden sm:block">{currentWorkspaceName}</p>
        <UserButton />
      </div>
    </div>
  )
}
