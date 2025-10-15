"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useModal } from "@/context/modal-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function UserRegisterForm() {
  const { register: registerUser } = useAuth();
  const { isLoginModalOpen, authMode, closeAuthModal, switchAuthMode } =
    useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register: registerRegisterForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegisterForm,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await registerUser(data.name, data.email, data.password);
      if (success) {
        resetRegisterForm();
        setSuccess("Registration successful! You are now logged in.");
        setTimeout(() => {
          closeAuthModal();
        }, 1500);
      } else {
        setError(
          "Email already registered. Please use a different email address."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "apple"
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate social login - replace with actual OAuth implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(`Logging in with ${provider}...`);
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } catch (err) {
      setError(`Failed to login with ${provider}. Please try again.`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setError(null);
    setSuccess(null);
    switchAuthMode("login");
  };

  // Theme-aware styles
  const buttonOutlineClass =
    "w-full bg-secondary border border-border hover:bg-accent text-foreground h-11";
  const buttonPrimaryClass =
    "w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium";
  const inputClass =
    "bg-background border-border text-foreground placeholder:text-muted-foreground h-10 focus:border-primary";
  const textMutedClass = "text-muted-foreground";
  const textPrimaryClass = "text-foreground";
  const errorClass =
    "bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4";
  const successClass =
    "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm mb-4";

  return (
    <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
      <FieldGroup>
        {error && <div className={errorClass}>{error}</div>}

        {success && <div className={successClass}>{success}</div>}

        <Field>
          <Button
            variant="outline"
            type="button"
            className={buttonOutlineClass}
            onClick={() => handleSocialLogin("apple")}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            Sign up with Apple
          </Button>
          <Button
            variant="outline"
            type="button"
            className={buttonOutlineClass}
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign up with Google
          </Button>
        </Field>

        <FieldSeparator
          className={`*:data-[slot=field-separator-content]:bg-background ${textMutedClass}`}
        >
          Or continue with
        </FieldSeparator>

        <Field>
          <FieldLabel htmlFor="register-name" className={textPrimaryClass}>
            Full Name
          </FieldLabel>
          <Input
            id="register-name"
            placeholder="Enter your full name"
            className={inputClass}
            {...registerRegisterForm("name")}
          />
          {registerErrors.name && (
            <p className="text-sm text-destructive mt-1">
              {registerErrors.name.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-email" className={textPrimaryClass}>
            Email
          </FieldLabel>
          <Input
            id="register-email"
            type="email"
            placeholder="m@example.com"
            className={inputClass}
            {...registerRegisterForm("email")}
          />
          {registerErrors.email && (
            <p className="text-sm text-destructive mt-1">
              {registerErrors.email.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="register-password" className={textPrimaryClass}>
            Password
          </FieldLabel>
          <Input
            id="register-password"
            type="password"
            placeholder="Create a password"
            className={inputClass}
            {...registerRegisterForm("password")}
          />
          {registerErrors.password && (
            <p className="text-sm text-destructive mt-1">
              {registerErrors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel
            htmlFor="register-confirmPassword"
            className={textPrimaryClass}
          >
            Confirm Password
          </FieldLabel>
          <Input
            id="register-confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className={inputClass}
            {...registerRegisterForm("confirmPassword")}
          />
          {registerErrors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">
              {registerErrors.confirmPassword.message}
            </p>
          )}
        </Field>

        <FieldDescription className={`px-0 text-center ${textMutedClass} `}>
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className={`${textPrimaryClass} hover:underline underline-offset-4`}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className={`${textPrimaryClass} hover:underline underline-offset-4`}
          >
            Privacy Policy
          </a>
          .
        </FieldDescription>

        <Field>
          <Button
            type="submit"
            className={buttonPrimaryClass}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <FieldDescription className={`text-center ${textMutedClass}`}>
            Already have an account?{" "}
            <button
              type="button"
              className={`${textPrimaryClass} hover:underline underline-offset-4 bg-transparent border-none cursor-pointer`}
              onClick={switchToLogin}
            >
              Login
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
