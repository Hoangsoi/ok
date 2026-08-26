import { NextResponse } from 'next/server';
import { recordClickLog } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || undefined;

    if (body.targetUrl) {
      await recordClickLog(body.targetUrl, userAgent, ipAddress);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
