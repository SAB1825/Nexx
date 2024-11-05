"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Task } from "../types"
import { ArrowUpDown, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectAvatar } from "@/features/projects/components/Project-avatar"
import { MembersAvatar } from "@/features/members/components/members-avatar"
import { TaskDate } from "./task-date"
import { Badge } from "@/components/ui/badge"
import { snakeCaseToTitleCase } from "@/lib/utils"
import { TaskActions } from "./task-actions"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.original.name
      return <p className="ml-2 line-clamp-1 text-zinc-300">{name}</p>
    },
  },
  {
    accessorKey: "projects",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const project = row.original.project
      return (
        <div className="flex items-center ml-2 gap-2">
          <ProjectAvatar
            className="h-6 w-6"
            name={project.name}
            image={project.image}
          />
          <p className="line-clamp-1 text-zinc-300">{project.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee
      return (
        <div className="flex items-center gap-2">
          <MembersAvatar
            className="h-6 w-6"
            fallbackClassName="text-xs bg-zinc-700 text-zinc-300"
            name={assignee.name}
          />
          <p className="line-clamp-1 text-zinc-300">{assignee.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate
      return <TaskDate value={dueDate} className="text-zinc-300" />
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const  id = row.original.$id
      const projectId = row.original.projectId
      return (
        <TaskActions id={id} projectId={projectId}>
          <Button variant="ghost" className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50">
            <MoreVertical className="size-6"/>
          </Button>
        </TaskActions>
      )
    }
  }
]