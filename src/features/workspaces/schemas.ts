import { z } from "zod";


export const WorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    imageUrl: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ])
})