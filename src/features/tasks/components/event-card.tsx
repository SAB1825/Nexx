import { Project } from "@/features/projects/types"
import { TaskStatus } from "../types"
import { cn } from "@/lib/utils"
import { MembersAvatar } from "@/features/members/components/members-avatar"
import { ProjectAvatar } from "@/features/projects/components/Project-avatar"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  id: string
  title: string
  project: Project
  status: TaskStatus
  assignee: {
    name: string
  }
}

const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "bg-red-500 hover:bg-red-600",
  [TaskStatus.IN_PROGRESS]: "bg-blue-500 hover:bg-blue-600",
  [TaskStatus.DONE]: "bg-green-500 hover:bg-green-600",
  [TaskStatus.BACKLOG]: "bg-gray-500 hover:bg-gray-600",
  [TaskStatus.IN_REVIEW]: "bg-purple-500 hover:bg-purple-600",
}

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.IN_REVIEW]: "In Review",
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  project,
  status,
  assignee,
}) => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "w-full bg-zinc-900 border-zinc-700 border-b-none border-l-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer",
        statusColors[status].replace("bg-", "border-l-")
      )}
    >
      <CardContent className="p-2 flex flex-col gap-y-1">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("text-[10px] font-medium", statusColors[status])}
          >
            {statusLabels[status]}
          </Badge>
          <div className="flex items-center gap-x-1">
            <MembersAvatar name={assignee?.name} className="size-4" />
            <ProjectAvatar name={project?.name} className="size-4" />
          </div>
        </div>
        <p className="text-xs font-medium text-zinc-100 line-clamp-2">{title}</p>
      </CardContent>
    </Card>
  )
}