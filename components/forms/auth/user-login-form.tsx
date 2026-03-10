import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useModal } from '@/context/modal-context';
import { LoginFormValues, loginSchema } from '@/lib/validations/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function UserLoginForm() {
  const { login } = useAuth();
  const { closeAuthModal, switchAuthMode } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register: registerLoginForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const success = await login(data.email, data.password);
      if (success) {
        resetLoginForm();
        setSuccess('Login successful!');
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: 'google' | 'facebook' | 'apple'
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

  const switchToRegister = () => {
    setError(null);
    setSuccess(null);
    switchAuthMode('register');
  };

  // Theme-aware styles
  const buttonOutlineClass =
    'w-full bg-secondary border border-border hover:bg-accent text-foreground h-11';
  const buttonPrimaryClass =
    'w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-medium';
  const inputClass =
    'bg-background border-border text-foreground placeholder:text-muted-foreground h-10 focus:border-primary';
  const textMutedClass = 'text-muted-foreground';
  const textPrimaryClass = 'text-foreground';
  const errorClass =
    'bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4';
  const successClass =
    'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm mb-4';

  return (
    <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
      <FieldGroup>
        {error && <div className={errorClass}>{error}</div>}

        {success && <div className={successClass}>{success}</div>}

        <Field>
          <Button
            variant="outline"
            type="button"
            className={buttonOutlineClass}
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-2 h-5 w-5"
            >
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            Login with Apple
          </Button>
          <Button
            variant="outline"
            type="button"
            className={buttonOutlineClass}
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="mr-2 h-5 w-5"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </Field>

        <FieldSeparator
          className={`*:data-[slot=field-separator-content]:bg-background ${textMutedClass}`}
        >
          Or continue with
        </FieldSeparator>

        <Field>
          <FieldLabel htmlFor="login-email" className={textPrimaryClass}>
            Email
          </FieldLabel>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            className={inputClass}
            required
            {...registerLoginForm('email')}
          />
          {loginErrors.email && (
            <p className="mt-1 text-sm text-destructive">
              {loginErrors.email.message}
            </p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password" className={textPrimaryClass}>
              Password
            </FieldLabel>
            <a
              href="#"
              className={`ml-auto text-sm ${textMutedClass} underline-offset-4 hover:${textPrimaryClass} hover:underline`}
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="login-password"
            type="password"
            className={inputClass}
            required
            {...registerLoginForm('password')}
          />
          {loginErrors.password && (
            <p className="mt-1 text-sm text-destructive">
              {loginErrors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            className={buttonPrimaryClass}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          <FieldDescription className={`text-center ${textMutedClass}`}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className={`${textPrimaryClass} cursor-pointer border-none bg-transparent underline-offset-4 hover:underline`}
              onClick={switchToRegister}
            >
              Sign up
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
