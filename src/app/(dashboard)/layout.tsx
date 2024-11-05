import { Navbar } from '@/components/Navigations/Navbar'
import { Sidebar } from '@/components/Navigations/Sidebar'
import { CreateProjectModal } from '@/features/projects/components/create-project-modal'
import { EditTaskModal } from '@/features/tasks/components/create-edit-modal'
import { CreateTaskModal } from '@/features/tasks/components/create-task-modal'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className='bg-zinc-900 min-h-screen'>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className='flex w-full h-full'>
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className='flex-1 lg:pl-[264px]'>
          <Navbar />
          <main className='mt-16 py-8 px-6 max-w-7xl mx-auto w-full'>      
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
