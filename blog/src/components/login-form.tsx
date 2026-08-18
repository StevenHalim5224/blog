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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, SyntheticEvent } from "react"
import { axiosInstance } from "@/lib/axios"
import { useAuth } from "@/stores/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {onAuthSuccess} = useAuth();
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("") 
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit= async (e: SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg ("")
    
    try{
      const response = await axiosInstance.post('/login', {
        email,
        password,
      })
      
      const {token,user} = response.data
      onAuthSuccess(user, token)
      
      router.push("/")
    } catch (error: any) {
    setErrorMsg(error.response?.data?.message || "An error occurred while logging in")
  } finally {
    setIsLoading(false)
  }
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
          <form onSubmit = {handleSubmit}>
            <FieldGroup>
              {errorMsg && (
                <div className = "text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md text-center" >
                  {errorMsg}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange= {(e) => setEmail(e.target.value)} 
                  required
                  disabled= {isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword (e.target.value)}
                  required 
                  disabled={isLoading}
                 />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/blog/Sign-up">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
