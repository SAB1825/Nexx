"use client"

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/useInviteCode";
import { useWorkspaceId } from "../hooks/useWorkspaceId";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  }
}

export default function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
    const router = useRouter()
    const { mutate: joinWorkspace, isPending } = useJoinWorkspace()
    
    const inviteCode = useInviteCode()
    const workspaceId = useWorkspaceId()
    const onSubmit = () => {
        joinWorkspace({
            param: {workspaceId},
            json: {code: inviteCode}
        },{
            onSuccess: ({data}) => {
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }
    return (
    <Card className="border-none rounded-xl shadow-lg bg-gradient-to-br from-zinc-900 to-black max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-2xl font-bold">Join Workspace</h3>
          <UserPlusIcon className="text-orange-500 w-8 h-8" />
        </div>
        <p className="text-zinc-300 text-sm mb-6">
          You have been invited to join <strong className="text-orange-500">{initialValues.name}</strong> workspace. 
          Please enter the invite code to join.
        </p>
        
        <hr className="border-zinc-800 mb-6" />
        <div className="space-y-4">
          <Button onClick={onSubmit} disabled={isPending} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300">
            Join Workspace
          </Button>
          <Button disabled={isPending} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300" asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}