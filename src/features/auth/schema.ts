import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 8 characters long'),
})

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 8 characters long'),
    name: z.string().min(3, 'Name must be at least 3 characters long'),
})

