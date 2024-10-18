import { UserButton } from "@/features/auth/components/UserButton"
import { MobileSidebar } from "./mobile-navbar"

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-zinc-700 z-10  lg:left-[264px]">
      <div className="flex items-center justify-between h-full max-w-6xl mx-auto px-4">
        <MobileSidebar />
        <p className="text-white text-2xl hidden sm:block">Welcome, Manage your project here</p>
        <UserButton />
      </div>
    </div>
  )
}
