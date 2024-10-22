import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MembersAvatarProps {
    name: string;
    className?: string;
    fallbackClassName?: string;
}

export const MembersAvatar = ({ name, className, fallbackClassName}: MembersAvatarProps) => {
    return (
        <Avatar className="rounded-md">
            <AvatarFallback className={cn("bg-blue-600", fallbackClassName)}>
                {name.charAt(0).toUpperCase()}   
            </AvatarFallback>
        </Avatar>
    )
}
