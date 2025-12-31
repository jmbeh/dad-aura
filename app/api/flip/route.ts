import { NextRequest, NextResponse } from 'next/server';
import { performFlip, getFlipStatus } from '@/lib/flip-manager';
import { supabase } from '@/lib/supabase';
import { createRateLimitMiddleware } from '@/lib/rate-limiter';
import type { FlipStatusResponse, FlipResponse } from '@/types/api';

// Rate limit: 30 requests per 15 minutes
const rateLimitMiddleware = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
});

/**
 * GET /api/flip
 * Get flip status (can dad flip today?)
 */
export async function GET(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = rateLimitMiddleware(request);
  if (rateLimitResult.error) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const status = await getFlipStatus();
    return NextResponse.json<FlipStatusResponse>(status, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('Error getting flip status:', error);
    return NextResponse.json(
      { error: 'Failed to get flip status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/flip
 * Perform a flip (dad only)
 * Body: { currentTotal: number }
 */
export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = rateLimitMiddleware(request);
  if (rateLimitResult.error) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { currentTotal } = body;

    if (typeof currentTotal !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid currentTotal' },
        { status: 400 }
      );
    }

    // Get current total from database to verify
    const { data: events } = await supabase
      .from('aura_events')
      .select('points');

    const actualTotal = events?.reduce((sum, e) => sum + e.points, 0) || 0;

    // Allow small discrepancy due to timing
    if (Math.abs(actualTotal - currentTotal) > 10) {
      return NextResponse.json(
        { 
          error: 'Current total mismatch. Please refresh and try again.',
          actualTotal,
        },
        { status: 400 }
      );
    }

    const result = await performFlip(actualTotal);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json<FlipResponse>({
      success: true,
      previousTotal: actualTotal,
      newTotal: result.newTotal!,
      message: `Flip successful! ${actualTotal} → ${result.newTotal}`,
    }, {
      headers: {
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('Error performing flip:', error);
    return NextResponse.json(
      { error: 'Failed to perform flip' },
      { status: 500 }
    );
  }
}

