"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { UpdateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface CreateWorkspaceFormProps {
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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { 
  Avatar,
  AvatarFallback,

} from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTimeout } from "react-use";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";

export const CreateWorkspaceForm = ({ onCancel, initialValues }: CreateWorkspaceFormProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateWorkspace()
  const form = useForm<z.infer<typeof UpdateWorkspaceSchema>>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? ""
    },
  });

  const onSubmit = (data: z.infer<typeof UpdateWorkspaceSchema>) => {
    console.log(data);

    const finalValues = {
      ...data,
      image: data.image instanceof File ? data.image : undefined
    }
    mutate({
        form: finalValues,
        param: { workspaceId: initialValues.$id }
    },{
      onSuccess: ({data}) => {
        form.reset();
          router.push(`/dashboard/workspaces/${data.$id}`)
      }
    })
   };
   
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  }

  return (
    <Card className="w-full border-none max-w-md mx-auto rounded-lg shadow-lg bg-black">
      <CardHeader className="p-8 border-b border-gray-700">
        <CardTitle className="text-2xl font-bold text-white">
          {initialValues.name}
        </CardTitle>
        <CardDescription className="text-gray-400 mt-2">
          Enter the details for your new workspace below.
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
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control = {form.control}
              name = "image"
              render = {({field}) => (
                <div className = "flex flex-col gap-2">
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className = "relative size-[74px] rounded-md overflow-hidden">
                        <Image 
                          src={
                            field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                          }
                          alt="Workspace Image"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                    ): (
                      <div>
                        <Avatar className = "size-[74px] rounded-md">
                          <AvatarFallback className="bg-gray-800 border border-gray-700 rounded-md">
                            <ImageIcon className="size-[30px] text-white rounded-md"/>
                          </AvatarFallback>

                        </Avatar>
                      </div>
                    )}
                    <div>
                      <p className="text-white text-xl font-medium">Workspace Icon</p>
                      <p className="text-gray-400 text-xs">Maximum file: size 2 MB</p>
                      <p className="text-gray-400 text-xs">Supported Formats: PNG, JPG, SVG, JPEF</p>
                      <input 
                        className="hidden"
                        type="file"
                        accept=".png, .jpg, .svg, .jpeg"
                        ref={inputRef}
                        disabled={isPending}
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        
                        className="w-fit mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => inputRef.current?.click()}
                        disabled={isPending}
                      >
                        Choose a file
                      </Button>
                    </div>

                  </div>
                </div>

              )}
            />
            <div className="pt-6 space-y-4">
              <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                Create Workspace
              </Button>
              <Button onClick={onCancel} disabled={isPending} className={cn("w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out", !onCancel  && "hidden")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
