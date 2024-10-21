"use client"
import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-2">
      {routes.map((route) => {
        const fullhref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullhref;
        const Icon = isActive ? route.activeIcon : route.icon;
        return (
          <Link key={route.href} href={fullhref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition-all duration-300 ease-in-out",
                "hover:bg-white/10 hover:text-green-400 group",
                isActive ? "text-black bg-white" : "text-black"
              )}
            >
              <Icon className="w-5 h-5 text-white group-hover:text-green-400" />
              <span className="text-white group-hover:text-green-400 group-hover:-translate-y-0.5 transition-transform duration-300">
                {route.label}
              </span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
