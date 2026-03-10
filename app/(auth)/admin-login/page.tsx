'use client';

import AdminLoginForm from '@/components/forms/auth/admin-login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700/50 bg-slate-800/50 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-3">
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
              Forgot your password?{' '}
              <button className="font-medium text-purple-400 transition-colors hover:text-purple-300">
                Reset here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
