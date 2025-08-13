'use client';

import { lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from './button';
import { signup } from '../lib/actions';
import { useActionState } from 'react';
import Link from 'next/link';

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <form className='space-y-3' action={formAction}>
      <div className='flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8'>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Create your account</h1>
        <div className='w-full'>
          <div>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='name'>
              Full Name
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='name'
                type='text'
                name='name'
                placeholder='Enter your full name'
                required
                aria-describedby='name-error'
              />
              <UserIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
            <div id='name-error' aria-live='polite' aria-atomic='true'>
              {state?.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='email'
                type='email'
                name='email'
                placeholder='Enter your email address'
                required
                aria-describedby='email-error'
              />
              <AtSymbolIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
            <div id='email-error' aria-live='polite' aria-atomic='true'>
              {state?.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className='mt-4'>
            <label className='mb-3 mt-5 block text-xs font-medium text-gray-900' htmlFor='password'>
              Password
            </label>
            <div className='relative'>
              <input
                className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
                id='password'
                type='password'
                name='password'
                placeholder='Enter password (minimum 6 characters)'
                required
                minLength={6}
                aria-describedby='password-error'
              />
              <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
            <div id='password-error' aria-live='polite' aria-atomic='true'>
              {state?.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className='mt-2 text-sm text-red-500' key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <Button className='mt-4 w-full' aria-disabled={isPending}>
          {isPending ? 'Creating account...' : 'Sign up'} <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
        </Button>
        <div className='flex h-8 items-end space-x-1' aria-live='polite' aria-atomic='true'>
          {state?.message && (
            <>
              <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
              <p className='text-sm text-red-500'>{state.message}</p>
            </>
          )}
        </div>
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-500 hover:underline'>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}