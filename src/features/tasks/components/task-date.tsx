import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

interface TaskDateProps {
    value: string;
    className?: string;
}

export const TaskDate = ({ value, className }: TaskDateProps) => {
    const today = new Date()
    const endDate = new Date(value)
    const diffInDays = differenceInDays(endDate, today)
    
    let textColor = "text-muted-foreground";
    if (diffInDays <= 3) {
        textColor = "text-red-500"
    } else if (diffInDays <= 7) {
        textColor = "text-yellow-500"
    } else if (diffInDays <= 30) {
        textColor = "text-blue-500"
    }
    return (
        <div className = {cn("text-xs", textColor, className)}>
            <span className = {cn("truncate", textColor)}>
                {format(value, "PPP")}
            </span>
        </div>
    )
}
