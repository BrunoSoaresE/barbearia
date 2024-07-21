'use server';

import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';



export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export  async function authUsuario(){
  const session = await auth()

  const now = new Date();
  const tokenExpiration = new Date(session?.expires ?? "");
  
  if (now < tokenExpiration === false) {
      redirect('/login');
  }
  
}