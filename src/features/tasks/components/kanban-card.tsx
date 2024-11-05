import { Button } from "@/components/ui/button";
import { Task } from "../types"
import { MoreHorizontalIcon } from "lucide-react";
import { TaskActions } from "./task-actions";
import { MembersAvatar } from "@/features/members/components/members-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/Project-avatar";

interface KanbanCardProps {
    task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
    
    return (
        <div className= "bg-zinc-900 rounded shadow-md p-2.5 space-y-3 hover:ring-1 hover:ring-zinc-600 mt-2">
            <div className="flex items-center justify-between gap-x-2">
                <h3 className="text-zinc-100 text-sm font-medium line-clamp-2">{task.name}</h3>
                <TaskActions id={task.$id} projectId={task.projectId}>
                    <MoreHorizontalIcon className="w-4 h-4 text-zinc-300 hover:text-white" />
                </TaskActions>
            </div>
            <hr className="border-zinc-700" />
            <div className="flex items-center gap-x-1.5">
                <MembersAvatar name={task.assignee.name} fallbackClassName="text-[10px]" className="size-5"/>
                <div className="size-1 rounded-full bg-zinc-700" />
                <TaskDate value={task.dueDate} className="text-xs" />  
            </div>
            <div className="flex items-center gap-x-1.5">
                <ProjectAvatar name={task.project.name} image={task.project.image} className="size-5" />
                <div className="size-1 rounded-full bg-zinc-700" />
                <span className="text-xs text-zinc-400">{task.project.name}</span>
            </div>


        </div>
    )
}