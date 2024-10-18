import { getCurrent } from '@/features/auth/actions';
import SignUp from '@/features/auth/components/Sign-up-page'
import { redirect } from 'next/navigation';
import React from 'react'

const SignUpPage = async () => {
  const user = await getCurrent();
  if(user !== null) {
    redirect('/dashboard')
  }
  return (
    <SignUp />
  )
}

export default SignUpPage