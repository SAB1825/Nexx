"use client"

import { MenuIcon, MenuSquare } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Sidebar } from "./Sidebar"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])
    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="text-white hover:text-black hover:bg-white lg:hidden">
                    <MenuIcon className="size-6 text-white hover:text-black hover:bg-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
