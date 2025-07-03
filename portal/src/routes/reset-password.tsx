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
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/modal'

interface EmailFormData {
  email: string
  newPassword: string
}

interface OtpFormData {
  otp: string
}

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

export default function ResetPasswordPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>()

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>()

  const createResetPasswordRequest =
    trpc.user.createResetPasswordRequestV1Mutation.useMutation({
      onSuccess: (data) => {
        setRequestId(data.requestId)
        setModalOpen(true)
      },
      onError: (error) => {
        setError(error.message)
      },
    })

  const verifyPasswordResetRequest =
    trpc.user.verifyPasswordResetRequest.useMutation({
      onSuccess: () => {
        setModalOpen(false)
        navigate({ to: '/login' })
      },
      onError: (error) => {
        setError(error.message)
      },
    })

  const onSubmitEmail = (data: EmailFormData) => {
    setError(null)
    setEmail(data.email)
    createResetPasswordRequest.mutate({
      email: data.email,
      newPassword: data.newPassword,
    })
  }

  const onSubmitOtp = (data: OtpFormData) => {
    setError(null)
    if (!requestId) return
    verifyPasswordResetRequest.mutate({
      requestId,
      otp: data.otp,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmitEmail(onSubmitEmail)}
            className="space-y-4"
          >
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              error={emailErrors.email?.message}
              disabled={createResetPasswordRequest.isPending}
              {...registerEmail('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              error={emailErrors.newPassword?.message}
              disabled={createResetPasswordRequest.isPending}
              {...registerEmail('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <Button
              type="submit"
              className="w-full"
              loading={createResetPasswordRequest.isPending}
              loadingText="Sending..."
              disabled={createResetPasswordRequest.isPending}
            >
              Send Reset Code
            </Button>
          </form>
        </CardContent>
      </Card>
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
          <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
            <Input
              label="OTP"
              type="text"
              placeholder="Enter the code sent to your email"
              error={otpErrors.otp?.message}
              disabled={verifyPasswordResetRequest.isPending}
              {...registerOtp('otp', {
                required: 'OTP is required',
                minLength: { value: 6, message: 'OTP must be 6 digits' },
                maxLength: { value: 6, message: 'OTP must be 6 digits' },
              })}
            />
            <Button
              type="submit"
              className="w-full"
              loading={verifyPasswordResetRequest.isPending}
              loadingText="Verifying..."
              disabled={verifyPasswordResetRequest.isPending}
            >
              Verify
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  )
}
