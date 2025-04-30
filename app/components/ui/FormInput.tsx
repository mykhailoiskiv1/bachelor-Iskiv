'use client'

import { InputHTMLAttributes } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type Props = {
  label: string
  error?: FieldError
  register: UseFormRegisterReturn
} & InputHTMLAttributes<HTMLInputElement>

export default function FormInput({ label, error, register, ...rest }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-black">{label}</label>
      <input {...register} {...rest} className="w-full mt-1 p-2 border rounded" />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  )
}
