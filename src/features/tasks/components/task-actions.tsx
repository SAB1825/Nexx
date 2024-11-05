import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ExternalLink, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { useEditTasksModal } from "../hooks/use-edit-tasks-modal";

interface TaskActionsProps {
    id: string;
    projectId: string;
    children: React.ReactNode;
}

export function TaskActions({id, projectId, children}: TaskActionsProps) {
    const router = useRouter();
    const  workspaceId  = useWorkspaceId();
    const { mutate: deleteTask, isPending } = useDeleteTask();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this task?",
        "This action cannot be undone.",
        "destructive"
    );

    const {open} = useEditTasksModal()
    const handleDelete = async () => {
        const ok = await confirm();
        if(ok) {
            deleteTask({param: {taskId: id}})
        }
    }
    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }
    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                    <DropdownMenuItem
                        onClick = {onOpenTask}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLink className="size-4 mr-2 stroke-zinc-500"/>
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick = {onOpenProject}
                        disabled = {false}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLink className="size-4 mr-2 stroke-zinc-500"/>
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick = {() => open(id)}
                        disabled = {false}
                        className="font-medium p-[10px]"
                    >
                        <Pencil1Icon className="size-4 mr-2 stroke-zinc-500"/>
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick = {handleDelete}
                        disabled = {isPending}
                        className="font-medium p-[10px] text-amber-700 focus:text-amber-500"
                    >
                        <TrashIcon className="size-4 mr-2 "/>
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    )
}