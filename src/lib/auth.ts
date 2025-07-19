// lib/auth.ts
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { users, sessions, type User } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '@/db';

export interface AuthUser extends Omit<User, 'passwordHash'> {}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await db.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt,
  });

  return sessionToken;
}

export async function getSession(): Promise<{ user: AuthUser; session: any } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  const result = await db
    .select({
      user: {
        id: users.id,
        email: users.email,
        name: users.name,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      },
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.sessionToken, sessionToken),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
}

export async function invalidateSession(sessionToken?: string): Promise<void> {
  if (!sessionToken) {
    const cookieStore = await cookies();
    sessionToken = cookieStore.get('session')?.value;
  }

  if (sessionToken) {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }
}

export async function requireAuth(): Promise<{ user: AuthUser; session: any }> {
  const auth = await getSession();
  if (!auth) {
    redirect('/auth/login');
  }
  return auth;
}

export async function setSessionCookie(sessionToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
