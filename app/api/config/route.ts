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

    const updates: Record<string, unknown> = {};

    if (body.targetUrl !== undefined) {
      if (typeof body.targetUrl !== 'string') {
        return NextResponse.json({ success: false, error: 'targetUrl phải là chuỗi hợp lệ' }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      updates.targetUrl = body.targetUrl.trim();
    }

    if (body.preloadEnabled !== undefined) {
      updates.preloadEnabled = Boolean(body.preloadEnabled);
    }

    if (body.preloadUrl !== undefined) {
      if (typeof body.preloadUrl !== 'string') {
        return NextResponse.json({ success: false, error: 'preloadUrl phải là chuỗi hợp lệ' }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      updates.preloadUrl = body.preloadUrl.trim();
    }

    if (body.preloadTimeout !== undefined) {
      const timeoutVal = Number(body.preloadTimeout);
      if (isNaN(timeoutVal) || timeoutVal <= 0) {
        return NextResponse.json({ success: false, error: 'preloadTimeout phải là số nguyên dương (ms)' }, { status: 400, headers: NO_CACHE_HEADERS });
      }
      updates.preloadTimeout = timeoutVal;
    }

    if (body.advertiserIframeEnabled !== undefined) {
      updates.advertiserIframeEnabled = Boolean(body.advertiserIframeEnabled);
    }

    if (body.advertiserIframeUrl !== undefined) {
      updates.advertiserIframeUrl = String(body.advertiserIframeUrl).trim();
    }

    if (body.advertiserIframeCode !== undefined) {
      updates.advertiserIframeCode = String(body.advertiserIframeCode).trim();
    }

    if (body.advertiserIframeTitle !== undefined) {
      updates.advertiserIframeTitle = String(body.advertiserIframeTitle).trim();
    }

    if (body.remainingSlots !== undefined) updates.remainingSlots = Number(body.remainingSlots);
    if (body.totalSlots !== undefined) updates.totalSlots = Number(body.totalSlots);
    if (body.topTickerText !== undefined) updates.topTickerText = String(body.topTickerText);
    if (body.eventBadgeText !== undefined) updates.eventBadgeText = String(body.eventBadgeText);
    if (body.eventTitle !== undefined) updates.eventTitle = String(body.eventTitle);
    if (body.eventSubtitle !== undefined) updates.eventSubtitle = String(body.eventSubtitle);
    if (body.eventWarningText !== undefined) updates.eventWarningText = String(body.eventWarningText);
    if (body.eventButtonText !== undefined) updates.eventButtonText = String(body.eventButtonText);
    if (body.brandName !== undefined) updates.brandName = String(body.brandName);
    if (body.brandTagline !== undefined) updates.brandTagline = String(body.brandTagline);
    if (body.payoutBadge !== undefined) updates.payoutBadge = String(body.payoutBadge);
    if (body.ribbonText !== undefined) updates.ribbonText = String(body.ribbonText);

    const result = await saveSiteConfig(updates);

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
