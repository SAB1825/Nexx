"use client"

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { RiAddCircleFill } from "react-icons/ri"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar"

export const WorkspaceSwitcher = () => {
  const { data: workspaces } = useGetWorkspaces()

  return (
    <div className="flex flex-col gap-y-4 bg-zinc-950 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-zinc-100 text-sm font-medium">Workspaces</span>
        <RiAddCircleFill className="w-5 h-5 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 cursor-pointer" />
      </div>
      <Select>
        <SelectTrigger className="w-full bg-zinc-900 text-zinc-100 border-zinc-800 h-15 hover:bg-zinc-800 focus:ring-1 focus:ring-zinc-700 transition-all duration-200 rounded-md">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 rounded-md shadow-lg">
          <SelectGroup>
            <SelectLabel className="text-zinc-400 px-2 py-1.5 text-xs font-semibold">Your Workspaces</SelectLabel>
            {workspaces?.documents.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="text-zinc-100 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-zinc-100 rounded-sm transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl}  />
                  <span className="font-medium truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}