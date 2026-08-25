"use client"

import Navbar from '@/components/Navbar'
import TiptapEditor from '@/components/TiptapEditor'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { axiosInstance } from '@/lib/axios'
import { useAuth } from '@/stores/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'


const formSchema = z.object({
    Title: z.string().min(5, "Title must be at least 5 characters."),
    Category: z.string().min(3, "Category must be at least 3 characters."),
    Content: z.string().min(20, "Content must be at least 10 characters."),
    imageUrl: z.string().min(1, "Image URL is required!").url("Thumbnail must be a valid URL."),
    prepTime: z.string().optional(),
    difficulty: z.string().optional()
})


const WritePage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            router.push("/login")
        }
    }, [token, router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Title: "",
            Category: "",
            Content: "",
            imageUrl: "",
            prepTime: "",
            difficulty: "",

        },
    })


    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);


            await axiosInstance.post(`/articles`, {
                title: data.Title,
                content: data.Content,
                category: data.Category,
                imageUrl: data.imageUrl,
                prepTime: data.prepTime,
                difficulty: data.difficulty
            });

            window.location.href=("/")

            toast.success("Blog has been created successfully!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const backendError = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "An error occured from server!"
                toast.error(backendError);
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
            <Navbar />

            <div className='container mx-auto p-4'>
                <form id="form-write" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="Title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="Title">Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id="Title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Your Blog Title"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                        <Controller
                            name="Category"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="Category">Category</FieldLabel>
                                    <Input
                                        {...field}
                                        id="Category"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=" Your blog Category"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                        <Controller
                            name="imageUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                                    <Input
                                        {...field}
                                        id="imageUrl"
                                        type="url"
                                        aria-invalid={fieldState.invalid}
                                        placeholder=" link image"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="Content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="Content">Content</FieldLabel>
                                        <TiptapEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                         <Controller
                            name="prepTime"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="prepTime">PrepTime</FieldLabel>
                                        <Input
                                            {...field}
                                            id="prepTime"
                                            aria-invalid={fieldState.invalid}
                                            placeholder='15 minute, 1 hour'
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="difficulty"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="difficulty">difficulty</FieldLabel>
                                        <Input
                                            {...field}
                                            id="difficulty"
                                            aria-invalid={fieldState.invalid}
                                            placeholder='Easy, Normal, Hard'
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />


                        <Field className='w-fit'>
                            <Button type="submit" form="form-write" disabled={isLoading}>
                                {isLoading ? "submitting..." : "Submit"}
                            </Button>
                        </Field>
                    </FieldGroup>

                </form>
            </div>
        </div>
    )
}

export default WritePage