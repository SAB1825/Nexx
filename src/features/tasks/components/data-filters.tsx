"use client"

import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetProjects } from "@/features/projects/api/use-get-projects"
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId"
import { FolderIcon, FoldersIcon, ListCheckIcon, Loader, UserIcon } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskStatus } from "../types"
import { useTaskFilter } from "../hooks/use-task-filter"
import { DatePicker } from "@/components/date-picker"

interface DataFiltersProps {
  hideProjectFilter?: boolean
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps = {}) => {
  const workspaceId = useWorkspaceId()
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId })
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId })
  const isLoading = isLoadingProjects || isLoadingMembers

  const projectOptions = projects?.documents.map((project) => ({
    label: project.name,
    value: project.$id,
  }))

  const memberOptions = members?.documents.map((member) => ({
    label: member.name,
    value: member.$id,
  }))

  const [{ projectId, status, assignedId, search, dueDate }, setFilters] = useTaskFilter()

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) })
  }

  const onAssigneeChange = (value: string) => {
    setFilters({ assignedId: value === "all" ? null : (value as string) })
  }

  const onProjectChange = (value: string) => {
    setFilters({ projectId: value === "all" ? null : (value as string) })
  }

  if (isLoading) return <Loader className="animate-spin text-white" />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-start">
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full bg-zinc-800 border-gray-700 text-gray-200">
          <div className="flex items-center">
            <ListCheckIcon className="w-4 h-4 mr-2 text-white" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator className="bg-gray-700" />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue={assignedId ?? undefined} onValueChange={onAssigneeChange}>
        <SelectTrigger className="w-full bg-zinc-800 border-gray-700 text-gray-200">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-white" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator className="bg-gray-700" />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
          <SelectTrigger className="w-full bg-zinc-800 border-gray-700 text-gray-200">
            <div className="flex items-center">
              <FoldersIcon className="w-4 h-4 mr-2 text-white" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator className="bg-gray-700" />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DatePicker
        placeholder="Due date"
        className="w-full bg-zinc-800 border-gray-700 text-gray-200"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => setFilters({ dueDate: date ? date.toISOString() : null })}
      />
    </div>
  )
}
