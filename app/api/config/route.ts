import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig, isNeonConfigured } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json(
    {
      ...config,
      neonConfigured: isNeonConfigured(),
    },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveSiteConfig({
      targetUrl: body.targetUrl,
      remainingSlots: body.remainingSlots !== undefined ? Number(body.remainingSlots) : undefined,
      totalSlots: body.totalSlots !== undefined ? Number(body.totalSlots) : undefined,
      topTickerText: body.topTickerText,
      eventBadgeText: body.eventBadgeText,
      eventTitle: body.eventTitle,
      eventSubtitle: body.eventSubtitle,
      eventWarningText: body.eventWarningText,
      eventButtonText: body.eventButtonText,
      brandName: body.brandName,
      brandTagline: body.brandTagline,
      payoutBadge: body.payoutBadge,
      ribbonText: body.ribbonText,
      ctaTitle: body.ctaTitle,
      ctaSubtitle: body.ctaSubtitle,
      ctaButtonText: body.ctaButtonText,
    });

    const updatedConfig = await getSiteConfig();
    return NextResponse.json(
      {
        success: true,
        config: updatedConfig,
        dbConnected: result.dbConnected,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
