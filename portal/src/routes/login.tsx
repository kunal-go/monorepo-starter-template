import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { trpc } from '@/contracts/trpc'
import { auth } from '@/lib/auth/auth'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginFormData {
  email: string
  password: string
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const loginMutation = trpc.user.loginV1Mutation.useMutation({
    onSuccess: (data) => {
      auth.setToken(data.accessToken)
      navigate({ to: '/' })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              disabled={loginMutation.isPending}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              disabled={loginMutation.isPending}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isPending}
              loadingText="Signing in..."
              disabled={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
