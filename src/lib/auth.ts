'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Global } from './directus';
import { DirectusUser } from '@directus/sdk';

export interface User extends DirectusUser {
  stage_name: string;
  schedule: number[];
  projects: number[];
  cast_roles: string[];
  position: string;
}

export type UserRecord = Record<
  string,
  User | { id: string; first_name: string; last_name: string }
>;

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(Global.COOKIE)?.value;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      },

      cache: 'no-store'
    });

    if (!res.ok) {
      redirect('/auth/login');
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Failed to fetch user', err);
    redirect('/auth/login');
  }
}
