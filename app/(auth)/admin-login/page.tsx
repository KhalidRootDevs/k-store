"use client";

import AdminLoginForm from "@/components/forms/auth/admin-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AdminLoginForm />

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Forgot your password?{" "}
              <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Reset here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
