"use client"
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/Project-avatar";
import { useCreateProjectModal } from "@/features/projects/hook/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export const Projects = () => {
  const projectId = null;

  const { open } = useCreateProjectModal()
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId
  });
  return (
    <div className="flex flex-col gap-y-4 bg-black p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-100 text-sm font-semibold">Projects</span>
        <RiAddCircleFill
          onClick={open}
          className="w-6 h-6 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "w-full border-none text-zinc-100 border border-zinc-800 p-1 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-700 transition-all duration-200 rounded-md",
                isActive && "bg-zinc-700 text-orange-500"
              )}
            >
              <div className="flex items-center gap-3">
                  <ProjectAvatar name={project.name} image={project.imageUrl}  />
                  <span className="font-medium truncate">{project.name}</span>
                </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
