import { NextResponse } from 'next/server';
import { recordVisitLog, getVisitStats } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const stats = await getVisitStats();
    return NextResponse.json(stats, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ totalVisits: 0, todayVisits: 0 }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || undefined;

    await recordVisitLog(userAgent, ipAddress);

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json({ success: false }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
