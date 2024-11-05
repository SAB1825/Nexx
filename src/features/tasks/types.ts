import { Models } from "node-appwrite";
import { Project } from "../projects/types";

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    IN_REVIEW = "IN_REVIEW"
}

export type Task = Models.Document & {
    name: string;
    status: TaskStatus;
    dueDate: string;
    projectId: string;
    assignedId: string;
    position: number;
    workspaceId: string;
    
}