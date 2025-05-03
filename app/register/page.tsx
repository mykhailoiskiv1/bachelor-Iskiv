'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '@/components/layout/Header'
import FooterMinimal from '@/components/layout/FooterMinimal'
import FormInput from '@/components/ui/FormInput'

type RegisterForm = {
  email: string
  password: string
  name: string
  address: string
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>()
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  const onSubmit = async (data: RegisterForm) => {
    setServerError('')
    setSuccessMsg('')

    try {
      const res = await axios.post('/api/auth/register', data)
      setSuccessMsg(res.data.message)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setServerError(err.response.data.error)
      } else {
        setServerError('Registration failed')
      }
    }
  }

  return (
    <>
      <Header />

      <div className="relative min-h-[calc(100vh-80px)] bg-[var(--color-background)] px-4 py-12 sm:py-20 flex flex-col items-center justify-start">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[var(--color-accent)]/10 via-white to-[var(--color-footer-bg)] clip-skew" />

        <header className="mb-10 text-center px-2">
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight leading-snug">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Join us to manage your projects and services.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
        >
          <FormInput
            label="Full Name"
            register={register('name', { required: 'Name is required' })}
            error={errors.name}
          />

          <FormInput
            label="Address"
            register={register('address', { required: 'Address is required' })}
            error={errors.address}
          />

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
          {successMsg && <p className="text-sm text-green-600 text-center">{successMsg}</p>}

          <button
            type="submit"
            className="w-full bg-[var(--color-button-bg)] text-[var(--color-button-text)] py-3 rounded-full text-base font-medium hover:bg-[var(--color-button-hover-bg)] transition"
          >
            Register
          </button>

          <p className="text-sm text-center text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <a href="/login" className="text-[var(--color-accent)] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>

      <FooterMinimal />
    </>
  )
}
