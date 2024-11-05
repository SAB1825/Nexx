"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { UpdateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface EditWorkspaceForm {
  onCancel?: () => void;
  initialValues: Workspace;
}
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, CopyIcon, ImageIcon, UserPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceForm) => {
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace?",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "Are you sure you want to Reset invite link?",
    "destructive"
  );
  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const form = useForm<z.infer<typeof UpdateWorkspaceSchema>>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });
  const {
    mutate: resetInviteCode,
    isPending: isResettingInviteCode,
  } = useResetInviteCode();
  const onSubmit = (data: z.infer<typeof UpdateWorkspaceSchema>) => {
    console.log(data);

    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    mutate(
      {
        form: finalValues,
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) {
      return;
    }
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };
  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) {
      return;
    }
    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteLink);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-y-6 max-w-md mx-auto">
      <ConfirmDialog />
      <ResetDialog />
      <Card className="border-none rounded-xl shadow-2xl bg-gradient-to-br from-zinc-900 to-black">
        <CardHeader className="p-8 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={
                onCancel
                  ? onCancel
                  : () => router.push(`/workspaces/${initialValues.$id}`)
              }
              className="gap-x-2 bg-zinc-800 text-white hover:bg-orange-500 transition-all duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            {initialValues.name}
          </CardTitle>
          <CardDescription className="text-zinc-400 mt-2">
            Update the details for your workspace below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-orange-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Workspace Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                      ) : (
                        <Avatar className="w-20 h-20 rounded-lg">
                          <AvatarFallback className="bg-zinc-800 border border-zinc-700 rounded-lg">
                            <ImageIcon className="w-10 h-10 text-zinc-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-white text-lg font-medium">
                          Workspace Icon
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Maximum file size: 2 MB
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Supported formats: PNG, JPG, SVG, JPEG
                        </p>
                        <input
                          className="hidden"
                          type="file"
                          accept=".png, .jpg, .svg, .jpeg"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        {field.value ? (
                          <Button
                            type="button"
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                            disabled={isPending}
                          >
                            Remove file
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                          >
                            Choose file
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
              <div className="pt-6 space-y-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  Update Workspace
                </Button>
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    disabled={isPending}
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="border-t border-zinc-800 my-6"></div>

      <Card className="border-none rounded-xl shadow-lg  bg-gradient-to-br from-zinc-900 to-black">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-semibold">Invite Members</h3>
            <UserPlusIcon className="text-white w-6 h-6" />
          </div>
          <p className="text-white text-sm mb-4">
            Share this link to invite members to your workspace
          </p>
          <div className="flex items-center gap-x-2">
            <Input
              readOnly
              value={fullInviteLink}
              className="bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-white"
            />
            <Button
              onClick={handleCopy}
              className="bg-white text-orange-600 hover:bg-orange-100 transition-colors duration-200"
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isPending || isResettingInviteCode}
            onClick={handleResetInviteCode}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            Reset Invite Link
          </Button>
        </CardContent>
      </Card>
      <div className="border-t border-zinc-800 my-6"></div>
      <Card className="border-none rounded-xl shadow-2xl bg-gradient-to-br from-red-900 to-black">
        <CardContent className="p-8">
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Danger Zone
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Once you delete your workspace, there is no going back. Please be
              certain.
            </p>
          </div>
          <Button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
