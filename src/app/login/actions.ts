'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;

  // Extremely simple password auth for prototype
  if (password === 'Atharva@2026') {
    (await cookies()).set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    redirect('/admin');
  } else {
    return { error: 'Invalid password' };
  }
}

export async function logoutAction() {
  (await cookies()).delete('admin_authenticated');
  redirect('/login');
}
