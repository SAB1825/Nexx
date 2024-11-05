"use client"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, PlusIcon } from 'lucide-react'
import React, { useCallback } from 'react'
import { useCreateTasksModal } from '../hooks/use-create-tasks-modal'
import { useWorkspaceId } from '@/features/workspaces/hooks/useWorkspaceId'
import { useGetTasks } from '../api/use-get-tasks'
import { useQueryState } from 'nuqs'
import { DataFilters } from './data-filters'
import { useTaskFilter } from '../hooks/use-task-filter'
import { DataTable } from './data-table'
import { columns } from './columns'
import { DataKanban } from './data-kanban'
import { TaskStatus } from '../types'
import { useBulkUpdateTask } from '../api/use-bulk-update-task'
import { DataCalender } from './data-caleneder'

const TaskViewSwitcher = () => {
  const { open } = useCreateTasksModal()
  const  workspaceId  = useWorkspaceId();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table", 
  })

  const [{projectId, status, assignedId, search, dueDate}] = useTaskFilter();
  const { mutate: bulkUpdateTask } = useBulkUpdateTask();

  const onKanbanChange = useCallback((tasks: {$id: string, status: TaskStatus; position: number;}[]) => {
    bulkUpdateTask({json: {tasks}})
  }, [bulkUpdateTask])

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId, projectId, status, assignedId, search, dueDate });
  return (
    <Tabs defaultValue={view} onValueChange={setView} className="flex-1 border-none rounded-lg h-7  lg:w-auto">
      <div className="h-full flex flex-col  overflow-auto  p-4">
        <div className='flex flex-col gap-y-2 lg:flex-row justify-between'>
        <TabsList className="w-full lg:w-auto bg-transparent">
          <TabsTrigger 
            value="table"
            className="h-8 w-full lg:w-auto text-white"
          >
            Table
          </TabsTrigger>
          <TabsTrigger 
            value="kanban"
            className="h-8 w-full lg:w-auto text-white "
          >
            Kanban
          </TabsTrigger>
          <TabsTrigger 
            value="calender"
            className="h-8 w-full lg:w-auto text-white "
          >
            Calendar
          </TabsTrigger>
        </TabsList>
        <Button 
        onClick={open}
        className='flex bg-orange-500 hover:bg-orange-600 items-center '>
          <PlusIcon />
          <span className='ml-2'>New</span>
        </Button>
        </div>
        <hr className='border-zinc-700 my-4' />
          <DataFilters />
        <hr className='border-zinc-700 my-4' />
        {isLoadingTasks ? 
          <div className='flex justify-center items-center h-full text-white'>
            <Loader2 className='animate-spin' />
          </div>
        : (
        
        <>
          <TabsContent value = "table" className='mt-0 ' >
            <DataTable columns={columns} data={tasks?.documents || []} />
          </TabsContent>
          <TabsContent value = "kanban" className='mt-0' >
            <DataKanban onChange={onKanbanChange} data={tasks?.documents || []} />
          </TabsContent>
          <TabsContent value = "calender" className='mt-0 h-full pb-4' >
            <DataCalender data={tasks?.documents ?? []} />
          </TabsContent>
        </>
        )}
      </div>
    </Tabs>
  )
}

export default TaskViewSwitcher
