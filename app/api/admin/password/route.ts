import { NextResponse } from 'next/server';
import { changeAdminPassword, getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, currentPassword, newPassword } = body;

    const config = await getSiteConfig();
    const currentStoredPass = config.adminPassword || 'admin123';

    // Verify password for login (Strictly check current stored password only)
    if (action === 'verify') {
      if (currentPassword && currentPassword === currentStoredPass) {
        return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
      } else {
        return NextResponse.json(
          { success: false, error: 'Mật khẩu không chính xác!' },
          { status: 401, headers: NO_CACHE_HEADERS }
        );
      }
    }

    // Change password
    if (action === 'change') {
      const result = await changeAdminPassword(currentPassword, newPassword);
      if (result.success) {
        return NextResponse.json(
          { success: true, message: result.message },
          { headers: NO_CACHE_HEADERS }
        );
      } else {
        return NextResponse.json(
          { success: false, error: result.message },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Hành động không hợp lệ' },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
