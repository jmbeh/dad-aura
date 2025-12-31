import { NextRequest, NextResponse } from 'next/server';
import type { LogoutResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  const response = NextResponse.json<LogoutResponse>({ success: true });
  
  // Clear auth cookie
  response.cookies.delete('dad-aura-auth');

  return response;
}

