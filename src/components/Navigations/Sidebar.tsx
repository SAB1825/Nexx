"use client"

import Image from "next/image"
import Link from "next/link"
import { Navigation } from "./navigations"
import { WorkspaceSwitcher } from "./Workspace-switcher"
import { Projects } from "../dashboard/projects"
import { Montserrat } from 'next/font/google'
import { Separator } from "@radix-ui/react-select"

const montserrat = Montserrat({ subsets: ['latin'] })

export const Sidebar = () => {
  return (
    <aside className={`h-full w-full bg-black border-r border-zinc-800 overflow-hidden ${montserrat.className}`}>
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 pt-8">
          
          <div className="space-y-2">
            <WorkspaceSwitcher />
            <hr className="border-zinc-900" />
            <Navigation />
            <hr className="border-zinc-900" />

            <Projects />
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #18181b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #52525b;
        }
        .sidebar-section {
          background: linear-gradient(to bottom, #111111, #000000);
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }
        .sidebar-section:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
      `}</style>
    </aside>
  )
}

export default function Component() {
  return <Sidebar />
}