import { sessionMiddleware } from "@/lib/session-middleware";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECT_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

const app = new Hono()
  .delete(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const database = c.get("database");
      const { taskId } = c.req.param();

      const task = await database.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);
      const member = await getMember({
        database,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if(!member) {
        return c.json({ error: "Member not found" }, 401);
      }

      await database.deleteDocument(DATABASE_ID, TASKS_ID, taskId);
      return c.json({data: { $id : taskId }});
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assignedId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const database = c.get("database");
      const user = c.get("user");
      const { workspaceId, projectId, status, search, dueDate, assignedId } =
        c.req.valid("query");

      const member = await getMember({
        database,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Member not found" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];
      if (projectId) {
        console.log(projectId);
        query.push(Query.equal("projectId", projectId));
      }
      if (status) {
        console.log(status);
        query.push(Query.equal("status", status));
      }
      if (assignedId) {
        console.log(assignedId);
        query.push(Query.equal("assignedId", assignedId));
      }
      if (dueDate) {
        console.log(dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }
      if (search) {
        console.log(search);
        query.push(Query.search("name", search));
      }

      const tasks = await database.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);
      const projectIds = tasks.documents.map((task) => task.projectId);
      const assignedIds = tasks.documents.map((task) => task.assignedId);
      const projects = await database.listDocuments<Project>(
        DATABASE_ID,
        PROJECT_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );
      const members = await database.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assignedIds.length > 0 ? [Query.contains("$id", assignedIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
        (project) => project.$id === task.projectId
        )
        const assignee = assignees.find(
        (assignee) => assignee.$id === task.assignedId
        )

        return {
            ...task,
            project,
            assignee
        }
      });
      return c.json({ data: {
        ...tasks,
        documents: populatedTasks
      } });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const database = c.get("database");
      const { name, status, workspaceId, projectId, dueDate, assignedId } =
        c.req.valid("json");

      const member = await getMember({
        database,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Member not found" }, 401);
      }

      const highestPositionTask = await database.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("position"),
          Query.limit(1),
        ]
      );

      const NewPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await database.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assignedId,
          position: NewPosition,
        }
      );

      return c.json({ data: task });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const database = c.get("database");
      const { name, status, description, projectId, dueDate, assignedId } =
        c.req.valid("json");

      const {taskId} = c.req.param();

      const existingTask = await database.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

      const member = await getMember({
        database,
        workspaceId : existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Member not found" }, 401);
      }

      

      

      const task = await database.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          dueDate,
          assignedId,
          description,
        }
      );

      return c.json({ data: task });
    }
  )
  .get(
    "/:taskId",
    sessionMiddleware,
    async (c) => {
      const currentUser = c.get("user");
      const database = c.get("database");
      const { users } = await createAdminClient();
      const {taskId} = c.req.param();

      const task = await database.getDocument<Task>(DATABASE_ID, TASKS_ID, taskId);

      const currentMember = await getMember({
        database,
        workspaceId: task.workspaceId,
        userId: currentUser.$id,
      });

      if(!currentMember) {
        return c.json({error: "Member not found"}, 401);
      }

      const project = await database.getDocument<Project>(DATABASE_ID, PROJECT_ID, task.projectId);
      const member = await database.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        task.assignedId
      )

      const user = await users.get(member.userId);

      const assignee = {
        ...member,
        name: user.name,
        email: user.email,
      }

      return c.json({data: {
        ...task,
        project,
        assignee
      }});
    }
  )
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator("json", z.object({tasks: z.array(z.object({$id: z.string(), status: z.nativeEnum(TaskStatus), position: z.number().int().positive().min(1000).max(1_000_000)}))})),
    async (c) => {
      const database = c.get("database");
      const {tasks} = await c.req.valid("json");
      const user = c.get("user");
      const tasksToUpdate = await database.listDocuments<Task>(
        DATABASE_ID, 
        TASKS_ID, 
        [Query.contains("$id", tasks.map((task) => task.$id))]
      );

      const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));
      if(workspaceIds.size !== 1) {
        return c.json({error: "Tasks must belong to the same workspace"}, 400);
      }

      const workspaceId = workspaceIds.values().next().value;
      const member = await getMember({
        database,
        workspaceId,
        userId: user.$id,
      });
      if(!member) {
        return c.json({error: "Member not found"}, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
         const {$id, status, position} = task;
         return database.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {status, position});
        })
      )

      return c.json({data: updatedTasks});
    }
  )

export default app;
