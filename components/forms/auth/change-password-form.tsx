'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { useAuth } from '@/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import InputField from '../../custom/input';
import toast from 'react-hot-toast';
import { PasswordFormValues, passwordSchema } from '@/lib/validations/index';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Your password has been changed successfully.');
        reset();
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <InputField
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              required
              disabled={isSubmitting}
            />

            <InputField
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              required
              disabled={isSubmitting}
            />
            <p className="-mt-2 text-sm text-muted-foreground">
              Must be at least 6 characters long
            </p>

            <InputField
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              required
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-end p-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
}
