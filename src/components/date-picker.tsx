"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  className?: string
  placeholder?: string
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select a date",
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-zinc-800 border-gray-700 text-white",
            "hover:bg-zinc-800 hover:text-gray-100",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900",
            !value && "text-white bg-zinc-800",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-white" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span className="text-white">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-zinc-800 border-gray-700"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-zinc-800 text-gray-200"
        />
      </PopoverContent>
    </Popover>
  )
}