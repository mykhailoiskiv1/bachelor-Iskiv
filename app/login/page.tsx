'use client'

import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type FormData = {
    email: string
    password: string
}

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const [serverError, setServerError] = useState('')
    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setServerError('')
        const res = await signIn('credentials', {
            ...data,
            redirect: false,
        })

        if (res?.error) {
            setServerError('Invalid email or password')
        } else if (res?.ok) {
            const sessionRes = await fetch('/api/auth/session')
            const session = await sessionRes.json()

            const role = session?.user?.role

            if (role === 'ADMIN') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-5"
            >
                <h1 className="text-2xl font-bold text-center text-black">Login</h1>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full mt-1 p-2 border rounded"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full mt-1 p-2 border rounded"
                    />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </div>

                {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}
