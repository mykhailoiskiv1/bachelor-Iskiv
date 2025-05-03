'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import FooterMinimal from '@/components/layout/FooterMinimal'
import FormInput from '@/components/ui/FormInput'
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
    <>
      <Header />

      <div className="relative min-h-[calc(100vh-80px)] bg-[var(--color-background)] px-4 py-12 sm:py-20 flex flex-col items-center justify-start">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[var(--color-accent)]/10 via-white to-[var(--color-footer-bg)] clip-skew" />

        <header className="mb-10 text-center px-2">
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight leading-snug">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Access your account to manage services and view updates.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
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

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--color-button-bg)] text-[var(--color-button-text)] py-3 rounded-full text-base font-medium hover:bg-[var(--color-button-hover-bg)] transition"
          >
            Sign In
          </button>

          <p className="text-sm text-center text-[var(--color-text-secondary)]">
            Don’t have an account?{' '}
            <a href="/register" className="text-[var(--color-accent)] hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>

      <FooterMinimal />
    </>
  )
}
