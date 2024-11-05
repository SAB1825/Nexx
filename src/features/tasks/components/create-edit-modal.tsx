"use client"
import { ResponsiveModal } from "@/components/dashboard/responsive-modal"
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal"
import { CreateTaskFormWrapper } from "./create-task-form-wrapper"
import { useEditTasksModal } from "../hooks/use-edit-tasks-modal"
import { EditTaskFormWrapper } from "./create-edit-form-wrapper"

export const EditTaskModal = () => {
    const { taskId , close } = useEditTasksModal()
    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            {taskId && (<EditTaskFormWrapper onCancel={close} id={taskId}/>)}
        </ResponsiveModal>
    )
}