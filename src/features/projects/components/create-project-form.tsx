"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface CreateWorkspaceFormProps {
  onCancel?: () => void;
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
import { useCreateProject } from "../api/use-create-project";
import { 
  Avatar,
  AvatarFallback,

} from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/useWorkspaceId";


export const CreateProjectForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateProject()
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof createProjectSchema>) => {
    console.log(data);

    const finalValues = {
      ...data,
      workspaceId,
      image: data.image instanceof File ? data.image : ""
    }
    mutate({
        form: finalValues
    },{
      onSuccess: ({data}) => {
        form.reset();
        router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
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
    <Card className="w-full max-w-md mx-auto border-none rounded-xl shadow-2xl bg-gradient-to-br from-zinc-900 to-black">
      <CardHeader className="p-8 border-b border-zinc-800">
        <CardTitle className="text-3xl font-bold text-white">
          Create a new Project
        </CardTitle>
        <CardDescription className="text-zinc-400 mt-2">
          Enter the details for your new project below.
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
                  <FormLabel className="text-white">Project Name</FormLabel>
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
                          src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
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
                      <p className="text-white text-lg font-medium">Project Icon</p>
                      <p className="text-zinc-400 text-xs">Maximum file size: 2 MB</p>
                      <p className="text-zinc-400 text-xs">Supported formats: PNG, JPG, SVG, JPEG</p>
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
                Create Project
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
  );
};
