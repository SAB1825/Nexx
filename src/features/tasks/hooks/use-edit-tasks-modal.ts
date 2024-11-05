import {useQueryState, parseAsBoolean, parseAsString} from "nuqs"

export const useEditTasksModal = () => {
    
    const [taskId, setTaskId] = useQueryState("edit-task", parseAsString) 
    const open = (id : string) => setTaskId(id)
    const close = () => setTaskId(null)
    return {
        taskId, 
        setTaskId,
        open,
        close
    }
}