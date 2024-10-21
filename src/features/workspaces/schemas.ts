import { z } from "zod";


export const WorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ])
    .optional()
})

export const UpdateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Must be at least 1 character long").optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ])
    .optional()
})
