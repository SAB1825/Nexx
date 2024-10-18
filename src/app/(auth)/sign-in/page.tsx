import { getCurrent } from '@/features/auth/actions'
import { SignIn } from '@/features/auth/components/Sign-in-page'
import { redirect } from 'next/navigation';
import React from 'react'

const SignInPage = async () => {
  const user = await getCurrent();
  if(user !== null) {
    redirect('/dashboard')
  }
  return (
    <SignIn/>
  )
}

export default SignInPage