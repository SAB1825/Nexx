import Image from "next/image"
import Link from "next/link"
import { Navigation } from "./navigations"


export const Sidebar = () => {
    return (
        <aside className = "p-4 pt-6 h-full w-full bg-black border-r border-zinc-700">
           <Link href="/" className="flex items-center gap-2">
            <Image
            src="/logo.svg"
            alt="logo"
            width={48}
            height={48}
            />
            <span className="text-white text-5xl font-bold">
                exx
            </span>
           </Link> 
           <hr className="my-6 border-zinc-700"/>
           <Navigation />
        </aside>
    )
}