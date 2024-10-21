import { Navbar } from '@/components/Navigations/Navbar'
import { Sidebar } from '@/components/Navigations/Sidebar'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className='bg-zinc-900 min-h-screen'>
      <CreateWorkspaceModal />
      <div className='flex w-full h-full'>
      <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
        <Sidebar />
      </div>
      <div className='lg:pl-[264px]'>
      <div className='mx-auto max-w-screen h-full'>
        <Navbar />
        <main className='mt-16 h-full py-8 px-6 flex flex-col'>      
          {children}
        </main>
        </div>
        </div>
      </div>
    </div>
  )
}