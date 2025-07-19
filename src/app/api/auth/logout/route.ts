import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession, clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session')?.value;
    
    if (sessionToken) {
      // Invalidate session in database
      await invalidateSession(sessionToken);
    }
    
    // Clear session cookie
    await clearSessionCookie();

    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

