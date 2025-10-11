"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/auth-context";
import { useModal } from "@/context/modal-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

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

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function LoginModal() {
  const { login, register: registerUser } = useAuth();
  const { isLoginModalOpen, authMode, closeAuthModal, switchAuthMode } =
    useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register: registerLoginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        resetLoginForm();
        setSuccess("Login successful!");
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleTabChange = (value: string) => {
    setError(null);
    setSuccess(null);
    switchAuthMode(value as "login" | "register");
  };

  return (
    <Dialog
      open={isLoginModalOpen}
      onOpenChange={(open) => !open && closeAuthModal()}
    >
      <DialogContent className="sm:max-w-[480px] bg-black border-gray-800 text-white p-0 gap-0">
        <div className="p-8">
          <Tabs
            value={authMode}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800 p-1 mb-8">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-400"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                <p className="text-gray-400 text-sm">
                  Enter your credentials to access your account
                </p>
              </div>

              <form
                onSubmit={handleLoginSubmit(onLoginSubmit)}
                className="space-y-5"
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="login-email"
                    className="text-sm text-gray-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerLoginForm("email")}
                  />
                  {loginErrors.email && (
                    <p className="text-sm text-red-400">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="login-password"
                    className="text-sm text-gray-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerLoginForm("password")}
                  />
                  {loginErrors.password && (
                    <p className="text-sm text-red-400">
                      {loginErrors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 h-11 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={isLoading}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("apple")}
                    disabled={isLoading}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  Create an account
                </h2>
                <p className="text-gray-400 text-sm">
                  Get started with your free account
                </p>
              </div>

              <form
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                className="space-y-5"
              >
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="register-name"
                    className="text-sm text-gray-300"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="register-name"
                    placeholder="Enter your full name"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerRegisterForm("name")}
                  />
                  {registerErrors.name && (
                    <p className="text-sm text-red-400">
                      {registerErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-email"
                    className="text-sm text-gray-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerRegisterForm("email")}
                  />
                  {registerErrors.email && (
                    <p className="text-sm text-red-400">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-password"
                    className="text-sm text-gray-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerRegisterForm("password")}
                  />
                  {registerErrors.password && (
                    <p className="text-sm text-red-400">
                      {registerErrors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-confirmPassword"
                    className="text-sm text-gray-300"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 h-11 focus:border-gray-600"
                    {...registerRegisterForm("confirmPassword")}
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-sm text-red-400">
                      {registerErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 h-11 font-medium"
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("facebook")}
                    disabled={isLoading}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-white h-11"
                    onClick={() => handleSocialLogin("apple")}
                    disabled={isLoading}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
