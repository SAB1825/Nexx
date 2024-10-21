import {useQueryState, parseAsBoolean} from "nuqs"

export const useCreateWorkspaceModal = () => {
    
    const [isOpen, setIsOpen] = useQueryState("create-workspace-modal", parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })) 
    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)
    return {
        isOpen, 
        setIsOpen,
        open,
        close
    }
}