import z from "zod";

export const registerValidation = z.object({
    name: z.string().min(3, "Minimum name must be 3 characters"),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,({message:"Format not valid"})),
    password: z.string().min(6, "Minimum password must be 6 characters")
})