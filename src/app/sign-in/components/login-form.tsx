"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/stores/auth"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "next-auth/react"

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters."),
})


export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const { onAuthSuccess } = useAuth()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { mutateAsync: login, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            const result = await axiosInstance.post("/api/users/login", {
                login: data.email,
                password: data.password
            });
            return result.data;
        },
        onSuccess: async (result) => {
            await signIn("credentials", {
                email: result.email,
                objectId: result.objectId,
                userToken: result["user-token"],
                redirect: false,
            });

            // onAuthSuccess({
            //     user: {
            //         email: result.data.email,
            //         objectId: result.data.objectId,
            //         userToken: result.data["user-token"],
            //     }
            // });

            toast.success("Login successful");
            router.push("/")
        },
        onError: () => {
            toast.error("invalid email or password")
        }
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await login(data);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="form-sign-in" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="m@example.com"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />


                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Your password"
                                                />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Field>
                                        <Button type="submit" form="form-sign-in" disabled={isPending}>
                                            {isPending ? "loading..." : "login"}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Don&apos;t have an account? <a href="Sign-up">Sign up</a>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )
        }
function mutateAsync(data: { email: string; password: string }) {
    throw new Error("Function not implemented.")
}

