import { createFileRoute, redirect } from '@tanstack/react-router'
import { auth } from '@/lib/auth/auth'
import { useAuth } from '@/lib/auth/use-auth'
import { trpc } from '@/contracts/trpc'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Check if access token exists
    if (!auth.isAuthenticated()) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: IndexPage,
})

function IndexPage() {
  const navigate = useNavigate()
  const { logout, isLoggingOut } = useAuth()
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null)
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<
    string | null
  >(null)
  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null,
  )
  const {
    register: registerChangePassword,
    handleSubmit: handleChangePasswordSubmit,
    formState: { errors: changePasswordErrors },
    reset: resetChangePassword,
    watch: watchChangePassword,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })
  const changePasswordMutation = trpc.user.changePasswordV1Mutation.useMutation(
    {
      onSuccess: () => {
        setChangePasswordSuccess('Password updated successfully!')
        setChangePasswordError(null)
        resetChangePassword()
        setTimeout(() => {
          setChangePasswordSuccess(null)
          setChangePasswordOpen(false)
        }, 1500)
      },
      onError: (err) => {
        setChangePasswordError(err.message)
        setChangePasswordSuccess(null)
      },
    },
  )

  // Fetch user details using trpc
  const { data: user, isLoading, error } = trpc.user.getSelfV1Query.useQuery()

  // Handle UNAUTHORIZED errors
  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') {
      auth.logout()
      navigate({ to: '/login' })
    }
  }, [error, navigate])

  const handleLogout = async () => {
    try {
      await logout()
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, redirect to login
      navigate({ to: '/login' })
    }
  }

  const handleRefreshToken = async () => {
    setRefreshStatus('Refreshing...')
    try {
      const result = await auth.refreshToken()
      setRefreshStatus(
        `Token refreshed successfully! New token: ${result.accessToken.substring(0, 20)}...`,
      )
      // Clear status after 3 seconds
      setTimeout(() => setRefreshStatus(null), 3000)
    } catch (error) {
      setRefreshStatus(
        `Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      // Clear status after 5 seconds
      setTimeout(() => setRefreshStatus(null), 5000)
    }
  }

  const onChangePasswordSubmit = (data: any) => {
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
    if (data.newPassword !== data.confirmNewPassword) {
      setChangePasswordError('New passwords do not match')
      return
    }
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading user details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Error</CardTitle>
            <CardDescription>
              Failed to load user details. Please try logging in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              className="w-full"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Go to Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Verification Status
                </label>
                <p className="text-gray-900">
                  {user?.isVerified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Not Verified</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Updated
                </label>
                <p className="text-gray-900">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user?.isVerified && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Account Verification Required
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please verify your email address to access all features.
                  </p>
                </div>
              )}

              {refreshStatus && (
                <div
                  className={`p-3 text-sm rounded-md ${
                    refreshStatus.includes('successfully')
                      ? 'text-green-700 bg-green-50 border border-green-200'
                      : refreshStatus.includes('Refreshing')
                        ? 'text-blue-700 bg-blue-50 border border-blue-200'
                        : 'text-red-700 bg-red-50 border border-red-200'
                  }`}
                >
                  {refreshStatus}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleRefreshToken}
                  className="w-full"
                  variant="outline"
                  disabled={refreshStatus?.includes('Refreshing')}
                >
                  {refreshStatus?.includes('Refreshing')
                    ? 'Refreshing...'
                    : 'Refresh Token'}
                </Button>
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </Button>
                <Button className="w-full" variant="outline">
                  Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Modal
          open={isChangePasswordOpen}
          onOpenChange={setChangePasswordOpen}
          title="Change Password"
          description="Update your account password"
        >
          <form
            onSubmit={handleChangePasswordSubmit(onChangePasswordSubmit)}
            className="space-y-4"
          >
            {changePasswordSuccess && (
              <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
                {changePasswordSuccess}
              </div>
            )}
            {changePasswordError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {changePasswordError}
              </div>
            )}
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              error={changePasswordErrors.currentPassword?.message}
              disabled={changePasswordMutation.isPending}
              {...registerChangePassword('currentPassword', {
                required: 'Current password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              error={changePasswordErrors.newPassword?.message}
              disabled={changePasswordMutation.isPending}
              {...registerChangePassword('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter your new password"
              error={changePasswordErrors.confirmNewPassword?.message}
              disabled={changePasswordMutation.isPending}
              {...registerChangePassword('confirmNewPassword', {
                required: 'Please confirm your new password',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                validate: (value) =>
                  value === watchChangePassword('newPassword') ||
                  'Passwords do not match',
              })}
            />
            <Button
              type="submit"
              className="w-full"
              loading={changePasswordMutation.isPending}
              loadingText="Updating..."
              disabled={changePasswordMutation.isPending}
            >
              Update Password
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
