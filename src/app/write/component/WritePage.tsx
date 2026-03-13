"use client"

import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { axiosInstance } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
 
interface ThumbnailResponse {
    fileURL: string;
    filePath: string;
}

const formSchema = z.object({
    Title: z.string().min(5, "Title must be at least 5 characters."),
    Author: z.string().min(3, "author must be at least 3 characters."),
    Category: z.string().min(3, "Category must be at least 3 characters."),
    Description: z.string().min(10, "Description must be at least 10 characters."),
    Content: z.string().min(10, "Content must be at least 10 characters."),
    Thumbnail: z.instanceof(File),
})

import React from 'react'

const writePage = () => {
   const router = useRouter();
    const [Loading, isLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Title: "",
            Author: "",
            Category: "",
            Description: "",
            Content: "",
            Thumbnail: undefined,
        },
    })

    const { mutateAsync: write, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const result = await axiosInstance.post("/api/users/login", {
                
            });
            return result.data;
        },
        onSuccess: (result) => {
            toast.success("blog created successful");
            router.push("/")
        },
        onError: () => {
            toast.error("blog created failed, try again.")
        }
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            isLoading(true);

            console.log("ini isi data", data);
            //1 upload thumbnail ke backendless di file service
            const formData = new FormData();
            const folderName = "Images";
            const fileName = Date.now() + Math.floor(Math.random() * 1000);
            const baseURL = "https://brightmitten-us.backendless.app"
            const url = `p/api/files/${folderName}/${fileName}`
            formData.append("File", data.Thumbnail)

            const result = await axiosInstance.post<ThumbnailResponse>(url, formData,);

            //2.create new data ke database backendless

            await axiosInstance.post(`/api/data/blogs`, {
                Author: data.Author,
                Category: data.Category,
                Content: data.Content,
                Description: data.Description,
                Title: data.Title,
                Thumbnail: result.data.fileURL,
            });

            toast.success("Blog has been created successfully!");
            router.push("/");
        } catch (error) {
            toast.error("An error occurred while submitting the form. Please try again.");
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
                                name="Author"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="Author">Author</FieldLabel>
                                        <Input
                                            {...field}
                                            id="Author"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Author"
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
                                name="Description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="Description">Description</FieldLabel>

                                        <Textarea
                                            {...field}
                                            id="Description"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your Blog Description"
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
                                        <Textarea
                                            {...field}
                                            id="Content"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your Blog Content"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="Thumbnail"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="Thumbnail">Thumbnail</FieldLabel>
                                        <Input
                                            id="Thumbnail"
                                            type="File"
                                            accept='image/*'
                                            aria-invalid={fieldState.invalid}
                                            placeholder=" Your Thumbnail"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];

                                                if (file) {
                                                    field.onChange(file);
                                                }
                                            }}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Field className='w-fit'>
                                <Button type="submit" form="form-write" disabled={Loading}>
                                    {Loading ? "submitting..." : "Submit"}
                                </Button>
                            </Field>
                        </FieldGroup>

                    </form>
                </div>
            </div>
        )
    }

export default writePage