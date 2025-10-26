"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { useAuth } from "@/context/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import InputField from "../../custom/input"
import toast from "react-hot-toast"

const emailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface ChangeEmailFormProps {
  onSuccess?: () => void
}

export function ChangeEmailForm({ onSuccess }: ChangeEmailFormProps) {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  })

  const { handleSubmit, reset } = methods

  const onSubmit = async (data: EmailFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/user/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newEmail: data.newEmail,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Your email has been updated successfully.")
        reset()
        await checkAuth()
        onSuccess?.()
      } else {
        throw new Error(result.error || "Failed to change email")
      }
    } catch (error: any) {
      console.error("Error changing email:", error)
      toast.error(error.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email Address</CardTitle>
        <CardDescription>Update the email address associated with your account</CardDescription>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <InputField
              name="newEmail"
              type="email"
              label="New Email Address"
              placeholder="Enter your new email address"
              required
              disabled={isSubmitting}
            />

            <InputField
              name="password"
              type="password"
              label="Confirm Password"
              placeholder="Enter your password to confirm"
              required
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-end p-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Email
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  )
}
