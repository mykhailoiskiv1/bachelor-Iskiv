'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type RegisterForm = {
  email: string;
  password: string;
  name: string;
  address: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    setSuccessMsg('');

    try {
      const res = await axios.post('/api/auth/register', data);
      setSuccessMsg(res.data.message);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError('Registration failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-bold text-center text-black">Register</h1>

        <div>
          <label className="block text-sm font-medium text-black">Name</label>
          <input {...register('name', { required: 'Name is required' })} className="w-full mt-1 p-2 border rounded" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Address</label>
          <input {...register('address', { required: 'Address is required' })} className="w-full mt-1 p-2 border rounded" />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 p-2 border rounded" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Password</label>
          <input type="password" {...register('password', { required: 'Password is required' })} className="w-full mt-1 p-2 border rounded" />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-red-500 text-center">{serverError}</p>}
        {successMsg && <p className="text-sm text-green-600 text-center">{successMsg}</p>}

        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          Register
        </button>
      </form>
    </div>
  );
}
