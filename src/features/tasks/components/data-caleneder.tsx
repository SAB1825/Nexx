"use client"

import { Task } from "../types"
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from 'date-fns'
import "./data-calendar.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { enUS } from 'date-fns/locale'
import { useState } from "react"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { cn } from "@/lib/utils"
import { EventCard } from "./event-card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface DataCalenderProps {
  data: Task[]
}

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

interface CustomToolbarProps {
  date: Date
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="flex items-center justify-between w-full gap-x-2 lg:justify-start bg-zinc-900 p-4 rounded-t-lg">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('PREV')}
        className="size-8 p-0 flex items-center bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
      >
        <ChevronLeft className="size-4 text-zinc-300" />
      </Button>
      <div className="bg-zinc-800 flex items-center border border-zinc-700 rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2 text-zinc-300" />
        <p className="text-zinc-300 text-sm font-medium">
          {format(date, 'MMMM yyyy', { locale: locales['en-US'] })}
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate('NEXT')}
        className="size-8 p-0 flex items-center bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
      >
        <ChevronRight className="size-4 text-zinc-300" />
      </Button>
    </div>
  )
}

export const DataCalender = ({ data }: DataCalenderProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  )
  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    status: task.status,
    assignee: task.assignee,
    id: task.$id,
  }))

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setValue(subMonths(value, 1))
    } else if (action === 'NEXT') {
      setValue(addMonths(value, 1))
    } else {
      setValue(new Date())
    }
  }

  return (
    <div className="h-full w-full bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <CustomToolbar 
        date={value}
        onNavigate={handleNavigate}
      />
      <Calendar 
        localizer={localizer}
        date={value}
        events={events}
        views={['month']}
        defaultView="month"
        toolbar={false}
        showAllEvents
        className={cn(
          "h-full border-none text-zinc-300",
          "rbc-calendar rbc-dark"
        )}
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        formats={{
          weekdayFormat: (date, culture, localizer) => 
            localizer?.format(date, 'EEE', culture) ?? ""
        }}
        components={{
          eventWrapper: ({ event }) => (
            <EventCard 
              id={event.id}
              title={event.title}
              project={event.project}
              status={event.status}
              assignee={event.assignee}
            />
          )
        }}
      />
    </div>
  )
}