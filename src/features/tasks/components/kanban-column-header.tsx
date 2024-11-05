import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types";
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal";


interface KanbanColumnHeaderProps  {
    board: TaskStatus;
    taskCount: number;
}
const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: <CircleDashedIcon className="w-4 h-4 text-pink-400" />,
    [TaskStatus.TODO]: <CircleIcon className="w-4 h-4 text-blue-400" />,
    [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="w-4 h-4 text-red-400" />,
    [TaskStatus.DONE]: <CircleCheckIcon className="w-4 h-4 text-green-400" />,
    [TaskStatus.IN_REVIEW]: <CircleDotIcon className="w-4 h-4 text-yellow-400" />,
}
export const KanbanColumnHeader = ({board, taskCount}: KanbanColumnHeaderProps) => {
    const { open } = useCreateTasksModal()
    const Icon = statusIconMap[board];
    return (
        <div className = "flex py-1.5 justify-between items-center p-2 ">
            <div className="flex items-center gap-x-2">
                {Icon}
                <h2 className="text-white ">
                    {snakeCaseToTitleCase(board)}
                </h2>
                <div className="text-zinc-800 size-5 flex items-center justify-center rounded-md bg-zinc-500 text-xs font-medium">
                    {taskCount}
                </div>
            </div>
            <Button variant="ghost" size="icon" className="size-5 hover:bg-orange-500" onClick={open}>
                <PlusIcon className="w-4 h-4 text-white hover:text-zinc-800" />
            </Button>
        </div>

    )
}
