import { neon } from '@neondatabase/serverless';
import fs from 'node:fs/promises';
import path from 'node:path';

const CONFIG_FILE = path.join(process.cwd(), '.openai', 'site-config.json');

export interface SiteConfig {
  targetUrl: string;
  preloadEnabled: boolean;
  preloadUrl: string;
  preloadTimeout: number;
  advertiserIframeEnabled: boolean;
  advertiserIframeUrl: string;
  advertiserIframeCode: string;
  advertiserIframeTitle: string;
  remainingSlots: number;
  totalSlots: number;
  topTickerText: string;
  eventBadgeText: string;
  eventTitle: string;
  eventSubtitle: string;
  eventWarningText: string;
  eventButtonText: string;
  brandName: string;
  brandTagline: string;
  payoutBadge: string;
  ribbonText: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  adminPassword?: string;
  isAutoRedirect: boolean;
  dbConnected?: boolean;
}

export interface PromotionCard {
  id?: number;
  sortOrder: number;
  icon: string;
  subtitle: string;
  title: string;
  highlightValue: string;
  actionText: string;
  isActive: boolean;
}

const DEFAULT_CONFIG: SiteConfig = {
  targetUrl: 'https://new88.com/khuyen-mai-500k',
  preloadEnabled: false,
  preloadUrl: '',
  preloadTimeout: 9000,
  advertiserIframeEnabled: false,
  advertiserIframeUrl: '',
  advertiserIframeCode: '',
  advertiserIframeTitle: '📺 ĐỐI TÁC TÀI TRỢ CHÍNH THỨC',
  remainingSlots: 147,
  totalSlots: 500,
  topTickerText: '🔥 CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT NĂM: ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ ✦ 🎁 KHÁCH HÀNG MỚI VÀ CỦ ĐỀU CÓ THỂ THAM GIA ✦ 💳 KHÔNG CẦN NẠP TIỀN - TOÀN CHƯƠNG TRÌNH CHỈ MỞ 500 SUẤT',
  eventBadgeText: '🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
  eventTitle: 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền',
  eventSubtitle: 'Đây không phải chương trình nạp tiền, cũng không phải quay thưởng! Bạn có thể đăng ký nhận mà không cần nạp tiền.',
  eventWarningText: '🚨 Tại sao bạn nên kiểm tra ngay bây giờ? Chương trình lần này áp dụng giới hạn số lượng, không phải lúc nào tất cả mọi người cũng có thể nhận. Khách hàng đáp ứng điều kiện sau khi truy cập trang chương trình độc quyền có thể kiểm tra tư cách tham gia của mình và xem chi tiết các quy định nhận thưởng. Chỉ có 500 suất — hết là dừng.',
  eventButtonText: '👇 NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
  brandName: 'NEW 88',
  brandTagline: 'NƠI CẢM XÚC KHÔNG GIỚI HẠN',
  payoutBadge: '⚡ NẠP RÚT NHANH CHÓNG 24/7',
  ribbonText: 'TRẢI NGHIỆM MƯỢT MÀ · NẠP RÚT NHANH CHÓNG',
  ctaTitle: 'Nhận Ngay Ưu Đãi 8,888K',
  ctaSubtitle: 'Trải nghiệm các trò chơi hấp dẫn nhất, nạp rút không giới hạn và nhận hàng ngàn phần quà lì xì mỗi ngày.',
  ctaButtonText: 'ĐĂNG KÝ TÀI KHOẢN NGAY →',
  adminPassword: 'admin123',
  isAutoRedirect: true,
};

function getDbClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes('npg_placeholder')) {
    return null;
  }
  try {
    return neon(connectionString);
  } catch {
    return null;
  }
}

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes('npg_placeholder'));
}

export async function initDatabase(): Promise<boolean> {
  const sql = getDbClient();
  if (!sql) return false;

  try {
    // 1. site_config table with all custom text, preload, advertiser iframe, and admin_password columns
    await sql`
      CREATE TABLE IF NOT EXISTS site_config (
        id INT PRIMARY KEY DEFAULT 1,
        brand_name VARCHAR(50) DEFAULT 'NEW 88',
        brand_tagline VARCHAR(100) DEFAULT 'NƠI CẢM XÚC KHÔNG GIỚI HẠN',
        payout_badge VARCHAR(100) DEFAULT '⚡ NẠP RÚT NHANH CHÓNG 24/7',
        target_url TEXT NOT NULL DEFAULT 'https://new88.com/khuyen-mai-500k',
        preload_enabled BOOLEAN DEFAULT false,
        preload_url TEXT DEFAULT '',
        preload_timeout INT DEFAULT 9000,
        advertiser_iframe_enabled BOOLEAN DEFAULT false,
        advertiser_iframe_url TEXT DEFAULT '',
        advertiser_iframe_code TEXT DEFAULT '',
        advertiser_iframe_title TEXT DEFAULT '📺 ĐỐI TÁC TÀI TRỢ CHÍNH THỨC',
        remaining_slots INT NOT NULL DEFAULT 147,
        total_slots INT NOT NULL DEFAULT 500,
        top_ticker_text TEXT,
        event_badge_text TEXT,
        event_title TEXT,
        event_subtitle TEXT,
        event_warning_text TEXT,
        event_button_text TEXT,
        ribbon_text TEXT,
        cta_title TEXT,
        cta_subtitle TEXT,
        cta_button_text TEXT,
        admin_password TEXT DEFAULT 'admin123',
        is_auto_redirect BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Ensure columns exist if table was previously created
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS admin_password TEXT DEFAULT 'admin123';`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS preload_enabled BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS preload_url TEXT DEFAULT '';`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS preload_timeout INT DEFAULT 9000;`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS advertiser_iframe_enabled BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS advertiser_iframe_url TEXT DEFAULT '';`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS advertiser_iframe_code TEXT DEFAULT '';`;
    await sql`ALTER TABLE site_config ADD COLUMN IF NOT EXISTS advertiser_iframe_title TEXT DEFAULT '📺 ĐỐI TÁC TÀI TRỢ CHÍNH THỨC';`;

    // 2. click_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS click_logs (
        id SERIAL PRIMARY KEY,
        target_url TEXT NOT NULL,
        action_name VARCHAR(100),
        user_agent TEXT,
        ip_address VARCHAR(50),
        clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Initialize site_config default row
    const existingConfig = await sql`SELECT id FROM site_config WHERE id = 1;`;
    if (existingConfig.length === 0) {
      await sql`
        INSERT INTO site_config (
          id, brand_name, brand_tagline, payout_badge, target_url, preload_enabled, preload_url, preload_timeout,
          advertiser_iframe_enabled, advertiser_iframe_url, advertiser_iframe_code, advertiser_iframe_title,
          remaining_slots, total_slots, top_ticker_text, event_badge_text, event_title, event_subtitle,
          event_warning_text, event_button_text, ribbon_text, cta_title, cta_subtitle, cta_button_text, admin_password, is_auto_redirect
        ) VALUES (
          1, ${DEFAULT_CONFIG.brandName}, ${DEFAULT_CONFIG.brandTagline}, ${DEFAULT_CONFIG.payoutBadge},
          ${DEFAULT_CONFIG.targetUrl}, ${DEFAULT_CONFIG.preloadEnabled}, ${DEFAULT_CONFIG.preloadUrl}, ${DEFAULT_CONFIG.preloadTimeout},
          ${DEFAULT_CONFIG.advertiserIframeEnabled}, ${DEFAULT_CONFIG.advertiserIframeUrl}, ${DEFAULT_CONFIG.advertiserIframeCode}, ${DEFAULT_CONFIG.advertiserIframeTitle},
          ${DEFAULT_CONFIG.remainingSlots}, ${DEFAULT_CONFIG.totalSlots},
          ${DEFAULT_CONFIG.topTickerText}, ${DEFAULT_CONFIG.eventBadgeText}, ${DEFAULT_CONFIG.eventTitle},
          ${DEFAULT_CONFIG.eventSubtitle}, ${DEFAULT_CONFIG.eventWarningText}, ${DEFAULT_CONFIG.eventButtonText},
          ${DEFAULT_CONFIG.ribbonText}, ${DEFAULT_CONFIG.ctaTitle}, ${DEFAULT_CONFIG.ctaSubtitle},
          ${DEFAULT_CONFIG.ctaButtonText}, 'admin123', true
        );
      `;
    }

    const existingUser = await sql`SELECT username FROM admin_users WHERE username = 'admin';`;
    if (existingUser.length === 0) {
      await sql`
        INSERT INTO admin_users (username, password_hash, role)
        VALUES ('admin', 'admin123', 'admin');
      `;
    }

    return true;
  } catch (err) {
    console.error('Neon DB init error:', err);
    return false;
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const sql = getDbClient();
  if (sql) {
    try {
      await initDatabase();
      const rows = await sql`
        SELECT * FROM site_config WHERE id = 1;
      `;
      if (rows.length > 0) {
        const row = rows[0];
        return {
          targetUrl: row.target_url || DEFAULT_CONFIG.targetUrl,
          preloadEnabled: row.preload_enabled !== null && row.preload_enabled !== undefined ? Boolean(row.preload_enabled) : DEFAULT_CONFIG.preloadEnabled,
          preloadUrl: row.preload_url ?? DEFAULT_CONFIG.preloadUrl,
          preloadTimeout: row.preload_timeout !== null && row.preload_timeout !== undefined ? Number(row.preload_timeout) : DEFAULT_CONFIG.preloadTimeout,
          advertiserIframeEnabled: row.advertiser_iframe_enabled !== null && row.advertiser_iframe_enabled !== undefined ? Boolean(row.advertiser_iframe_enabled) : DEFAULT_CONFIG.advertiserIframeEnabled,
          advertiserIframeUrl: row.advertiser_iframe_url ?? DEFAULT_CONFIG.advertiserIframeUrl,
          advertiserIframeCode: row.advertiser_iframe_code ?? DEFAULT_CONFIG.advertiserIframeCode,
          advertiserIframeTitle: row.advertiser_iframe_title || DEFAULT_CONFIG.advertiserIframeTitle,
          remainingSlots: row.remaining_slots !== null ? Number(row.remaining_slots) : DEFAULT_CONFIG.remainingSlots,
          totalSlots: row.total_slots !== null ? Number(row.total_slots) : DEFAULT_CONFIG.totalSlots,
          topTickerText: row.top_ticker_text || DEFAULT_CONFIG.topTickerText,
          eventBadgeText: row.event_badge_text || DEFAULT_CONFIG.eventBadgeText,
          eventTitle: row.event_title || DEFAULT_CONFIG.eventTitle,
          eventSubtitle: row.event_subtitle || DEFAULT_CONFIG.eventSubtitle,
          eventWarningText: row.event_warning_text || DEFAULT_CONFIG.eventWarningText,
          eventButtonText: row.event_button_text || DEFAULT_CONFIG.eventButtonText,
          brandName: row.brand_name || DEFAULT_CONFIG.brandName,
          brandTagline: row.brand_tagline || DEFAULT_CONFIG.brandTagline,
          payoutBadge: row.payout_badge || DEFAULT_CONFIG.payoutBadge,
          ribbonText: row.ribbon_text || DEFAULT_CONFIG.ribbonText,
          ctaTitle: row.cta_title || DEFAULT_CONFIG.ctaTitle,
          ctaSubtitle: row.cta_subtitle || DEFAULT_CONFIG.ctaSubtitle,
          ctaButtonText: row.cta_button_text || DEFAULT_CONFIG.ctaButtonText,
          adminPassword: row.admin_password || DEFAULT_CONFIG.adminPassword,
          isAutoRedirect: Boolean(row.is_auto_redirect),
          dbConnected: true,
        };
      }
    } catch (error) {
      console.warn('Neon DB query error:', error);
    }
  }

  // Fallback to JSON file
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data), dbConnected: false };
  } catch {
    return { ...DEFAULT_CONFIG, dbConnected: false };
  }
}

export async function saveSiteConfig(config: Partial<SiteConfig>): Promise<{ success: boolean; dbConnected: boolean }> {
  const currentConfig = await getSiteConfig();
  const updated = { ...currentConfig, ...config };
  let dbSuccess = false;

  const sql = getDbClient();
  if (sql) {
    try {
      await initDatabase();
      await sql`
        INSERT INTO site_config (
          id, target_url, preload_enabled, preload_url, preload_timeout,
          advertiser_iframe_enabled, advertiser_iframe_url, advertiser_iframe_code, advertiser_iframe_title,
          remaining_slots, total_slots, top_ticker_text, event_badge_text, event_title, event_subtitle,
          event_warning_text, event_button_text, brand_name, brand_tagline, payout_badge, ribbon_text,
          cta_title, cta_subtitle, cta_button_text, admin_password, is_auto_redirect, updated_at
        ) VALUES (
          1, ${updated.targetUrl}, ${updated.preloadEnabled}, ${updated.preloadUrl}, ${updated.preloadTimeout},
          ${updated.advertiserIframeEnabled}, ${updated.advertiserIframeUrl}, ${updated.advertiserIframeCode}, ${updated.advertiserIframeTitle},
          ${updated.remainingSlots}, ${updated.totalSlots}, ${updated.topTickerText}, ${updated.eventBadgeText},
          ${updated.eventTitle}, ${updated.eventSubtitle}, ${updated.eventWarningText}, ${updated.eventButtonText},
          ${updated.brandName}, ${updated.brandTagline}, ${updated.payoutBadge}, ${updated.ribbonText},
          ${updated.ctaTitle}, ${updated.ctaSubtitle}, ${updated.ctaButtonText},
          ${updated.adminPassword || 'admin123'}, ${updated.isAutoRedirect}, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          target_url = EXCLUDED.target_url,
          preload_enabled = EXCLUDED.preload_enabled,
          preload_url = EXCLUDED.preload_url,
          preload_timeout = EXCLUDED.preload_timeout,
          advertiser_iframe_enabled = EXCLUDED.advertiser_iframe_enabled,
          advertiser_iframe_url = EXCLUDED.advertiser_iframe_url,
          advertiser_iframe_code = EXCLUDED.advertiser_iframe_code,
          advertiser_iframe_title = EXCLUDED.advertiser_iframe_title,
          remaining_slots = EXCLUDED.remaining_slots,
          total_slots = EXCLUDED.total_slots,
          top_ticker_text = EXCLUDED.top_ticker_text,
          event_badge_text = EXCLUDED.event_badge_text,
          event_title = EXCLUDED.event_title,
          event_subtitle = EXCLUDED.event_subtitle,
          event_warning_text = EXCLUDED.event_warning_text,
          event_button_text = EXCLUDED.event_button_text,
          brand_name = EXCLUDED.brand_name,
          brand_tagline = EXCLUDED.brand_tagline,
          payout_badge = EXCLUDED.payout_badge,
          ribbon_text = EXCLUDED.ribbon_text,
          cta_title = EXCLUDED.cta_title,
          cta_subtitle = EXCLUDED.cta_subtitle,
          cta_button_text = EXCLUDED.cta_button_text,
          admin_password = EXCLUDED.admin_password,
          is_auto_redirect = EXCLUDED.is_auto_redirect,
          updated_at = NOW();
      `;
      dbSuccess = true;
    } catch (error) {
      console.warn('Failed to update Neon DB:', error);
    }
  }

  try {
    await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
    await fs.writeFile(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local config file:', err);
  }

  return { success: true, dbConnected: dbSuccess };
}

export async function changeAdminPassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const config = await getSiteConfig();
  const currentPass = config.adminPassword || 'admin123';

  if (oldPassword !== currentPass) {
    return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, message: 'Mật khẩu mới phải từ 4 ký tự trở lên!' };
  }

  await saveSiteConfig({ adminPassword: newPassword });

  const sql = getDbClient();
  if (sql) {
    try {
      await sql`
        UPDATE admin_users SET password_hash = ${newPassword} WHERE username = 'admin';
      `;
    } catch {
      // Ignore fallback
    }
  }

  return { success: true, message: 'Đổi mật khẩu thành công!' };
}

export async function recordClickLog(targetUrl: string, actionName?: string, userAgent?: string, ipAddress?: string): Promise<boolean> {
  const sql = getDbClient();
  if (!sql) return false;
  try {
    await sql`
      INSERT INTO click_logs (target_url, action_name, user_agent, ip_address)
      VALUES (${targetUrl}, ${actionName || 'CTA Click'}, ${userAgent || 'Unknown'}, ${ipAddress || 'Client'});
    `;
    return true;
  } catch {
    return false;
  }
}
