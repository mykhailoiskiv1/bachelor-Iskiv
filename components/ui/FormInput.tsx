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
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
      </label>
      <input
        {...register}
        {...rest}
        placeholder={label}
        className={`
          w-full rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)]
          bg-white/80 backdrop-blur-sm
          border transition-all duration-200
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-[var(--color-border)] hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]'}
          focus:outline-none focus:ring-1
        `}
      />
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}
