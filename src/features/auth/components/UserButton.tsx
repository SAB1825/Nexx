'use client'

import { Loader, LogOut } from "lucide-react"
import { useCurrent } from "../api/use-current"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLogout } from "../api/use-logout"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const UserButton = () => {
  const { mutate } = useLogout()
  const { data: user, isLoading } = useCurrent()
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 shadow-xl animate-pulse">
        <Loader className="size-4 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    console.log("User not found")
    return null
  }
  const onLogout = () => {
    setIsLoggingOut(true);
    mutate(undefined, {
      onSettled: () => {
        setIsLoggingOut(false);
        router.push('/sign-in');
      }
    });
  }
  const { name, email } = user
  const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative group ">
          <Avatar className="bg-zinc-900 cursor-pointer w-10 h-10 transition-transform duration-500 transform group-hover:scale-110 group-hover:ring-4 group-hover:ring-primary/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]">
            <AvatarFallback className="bg-black text-white text-2xl border-2 border-gray-800 font-bold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 size-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full border-2 border-zinc-900 group-hover:animate-ping"></span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={4}
          className="w-72 space-y-3 p-4 bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 text-zinc-100 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-500 transform group-hover:scale-100 group-hover:opacity-100"
        >
          <div className="flex items-center space-x-4 p-2">
            <Avatar className="size-16 ring-2 w-10 h-10 ring-gray-800 shadow-[0_0_20px_rgba(72, 129, 221, 0.7)]">
              <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-900 text-white font-bold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-white font-semibold text-lg text-primary tracking-wide">{name || "User"}</p>
              <p className="text-sm text-zinc-400">{email}</p>
            </div>
          </div>
          <hr className="border-zinc-800 opacity-40" />
          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center space-x-3 p-3 hover:bg-zinc-800/50 rounded-lg transition-all duration-300 group cursor-pointer transform group-hover:scale-105 group-hover:shadow-md"
          >
            <LogOut className="size-5 text-zinc-400 group-hover:text-red-600 transition-colors duration-300" />
            <p className="font-medium group-hover:text-red-600 transition-colors duration-300">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    
  )
}
