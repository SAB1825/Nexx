"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { WorkspaceSchema } from "../schemas";
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
import { useCreateWorkspace } from "../api/use-create-workspace";
export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const { mutate, isPending } = useCreateWorkspace()
  const form = useForm<z.infer<typeof WorkspaceSchema>>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof WorkspaceSchema>) => {
    console.log(data);
    mutate({
        json: data
    })
  };

  return (
    <Card className="w-full border-none max-w-md mx-auto rounded-lg shadow-lg bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader className="p-8 border-b border-gray-700">
        <CardTitle className="text-2xl font-bold text-white">
          Create a new workspace
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
            <div className="pt-6 space-y-4">
              <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                Create Workspace
              </Button>
              <Button onClick={onCancel} disabled={isPending} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
