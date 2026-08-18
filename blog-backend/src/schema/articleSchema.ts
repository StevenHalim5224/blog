import z from "zod";

export const articleValidation = z.object({
    title: z.string().min(5, "Min 5 character to make a title article!"). max(100,"Title article to long!"),
    content: z.string().min(20, "Min 20 character to input content"),
    category: z.string().min(1, "Category is required!"),
    imageUrl: z.string().url("Invalid URL format").optional(),
    prepTime: z.string().optional(),
    difficulty: z.string().optional()
});