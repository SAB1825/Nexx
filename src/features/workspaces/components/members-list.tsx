"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MembersAvatar } from "@/features/members/components/members-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RiAdminFill, RiUser2Fill } from "react-icons/ri";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";
import { Badge } from "@/components/ui/badge";

export default function MembersList() {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "Are you sure you want to remove this member?",
    "destructive"
  )
  const { data } = useGetMembers({workspaceId})
  const {
    mutate: deleteMember,
    isPending: isDeletingMember
  } = useDeleteMember();
  const {
    mutate: updateMember,
    isPending: isUpdatingMember
  } = useUpdateMember();

  const handleUpdateMember = (memberId: string, role : MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId }
    })
  }

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if(!ok) return;
    deleteMember({ param: { memberId } },
      {
        onSuccess: () => {
        window.location.reload();
      }
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-none rounded-xl shadow-2xl bg-gradient-to-br from-zinc-900 to-black">
      <ConfirmDialog />
      <CardHeader className="p-8 border-b border-zinc-800">
        <Button asChild variant="ghost" className="mb-4 text-zinc-400 hover:text-white hover:bg-orange-500 transition-all duration-300">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="mr-2" /> Go Back 
          </Link>
        </Button>
        <CardTitle className="text-3xl font-bold text-white">Members List</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {data?.documents.map((member, index) => (
          <div key={index} className="py-4 border-b border-zinc-800 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <MembersAvatar className="size-12 rounded-lg" fallbackClassName="bg-orange-500" name={member.name} />
                <div>
                  <p className="font-medium text-white text-lg">{member.name}</p>
                  <p className="text-sm text-zinc-400">{member.email}</p>j
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge 
                  variant={member.role === MemberRole.ADMIN ? "default" : "secondary"}
                  className="text-sm px-2 py-1"
                >
                  {member.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-300">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem 
                      disabled={isDeletingMember} 
                      onClick={() => handleDeleteMember(member.$id)}
                      className="text-red-400 focus:text-red-300 focus:bg-zinc-700 transition-all duration-300"
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Remove {member.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem  
                      disabled={isUpdatingMember || member.role === MemberRole.ADMIN} 
                      onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                      className="text-white focus:bg-zinc-700 transition-all duration-300"
                    >
                      <RiAdminFill className="mr-2 h-4 w-4" />
                      Set as Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      disabled={isUpdatingMember || member.role === MemberRole.MEMBER} 
                      onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                      className="text-white focus:bg-zinc-700 transition-all duration-300"
                    >
                      <RiUser2Fill className="mr-2 h-4 w-4" />
                      Set as Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}