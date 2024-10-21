import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {useMedia} from "react-use"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

interface ResponsiveModalProps {
    children : React.ReactNode,
    open : boolean,
    onOpenChange : (open : boolean) => void
}

export const ResponsiveModal = ({children, open, onOpenChange} : ResponsiveModalProps) => {
    const isDesktop = useMedia("(min-width: 1024px)", true)
    if(isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none bg-black overflow-y-auto hide-scrollbar max-h-[85vh]">{children}</DialogContent>
            </Dialog>
        )
    }
    return (
        <Drawer open={open} onOpenChange={onOpenChange} >
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh] bg-black">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}


