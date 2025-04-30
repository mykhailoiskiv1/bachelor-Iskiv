'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import FormInput from '../../components/ui/FormInput'
import { loginWithCredentials } from '@/lib/auth/loginWithCredentials'
import { useRoleRedirect } from '@/hooks/useRoleRedirect'

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [serverError, setServerError] = useState('')
  const redirectByRole = useRoleRedirect()

  const onSubmit = async ({ email, password }: FormData) => {
    setServerError('')
    const res = await loginWithCredentials(email, password)

    if (res?.error) {
      setServerError('Invalid email or password')
    } else if (res?.ok) {
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role
      redirectByRole(role)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        <FormInput
          label="Email"
          type="email"
          register={register('email', { required: 'Email is required' })}
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          register={register('password', { required: 'Password is required' })}
          error={errors.password}
        />

        {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm mt-2">
        Don’t have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </p>
    </div>
  )
}
