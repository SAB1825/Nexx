"use client"
import { ResponsiveModal } from "@/components/dashboard/responsive-modal"
import { useCreateTasksModal } from "../hooks/use-create-tasks-modal"
import { CreateTaskFormWrapper } from "./create-task-form-wrapper"

export const CreateTaskModal = () => {
    const { isOpen , close } = useCreateTasksModal()
    return (
        <ResponsiveModal open={isOpen} onOpenChange={close}>
            <CreateTaskFormWrapper onCancel={close}/>
        </ResponsiveModal>
    )
}