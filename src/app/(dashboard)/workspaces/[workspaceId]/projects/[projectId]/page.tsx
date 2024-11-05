import { Button } from "@/components/ui/button"
import { getCurrent } from "@/features/auth/actions"
import { getProject } from "@/features/projects/actions"
import { ProjectAvatar } from "@/features/projects/components/Project-avatar"
import TaskViewSwitcher from "@/features/tasks/components/task-view-swicther"
import { PencilIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"

interface ProjectIdPageProps {
  params: {
    projectId: string
  }
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-in")
  }

  const initialValues = await getProject({
    projectId: params.projectId,
  })
  if (!initialValues) {
    throw new Error("Project not found")
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues?.name}
            image={initialValues?.imageUrl}
            className="size-10"
          />
          <p className="text-white text-lg font-semibold">{initialValues?.name}</p>
        </div>
        <div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link
            href={`/workspaces/${initialValues?.workspaceId}/projects/${initialValues?.$id}/settings`}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Project
          </Link>
        </Button>
        </div>
      </div>
      <TaskViewSwitcher />
    </div>
  )
}
