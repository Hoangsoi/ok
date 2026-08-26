import fs from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=');
      const val = valParts.join('=').replace(/^["']|["']$/g, '').trim();
      process.env[key.trim()] = val;
    }
  }
}

const dbUrl = process.env.DATABASE_URL;
console.log('🔗 Connecting to Neon DB URL:', dbUrl ? dbUrl.substring(0, 35) + '...' : 'NONE');

if (!dbUrl || dbUrl.includes('npg_placeholder')) {
  console.error('❌ ERROR: DATABASE_URL in .env.local is missing or invalid!');
  process.exit(1);
}

const sql = neon(dbUrl);

async function migrate() {
  try {
    console.log('⏳ Creating database tables on Neon Postgres...');

    // 1. site_config
    await sql`
      CREATE TABLE IF NOT EXISTS site_config (
        id INT PRIMARY KEY DEFAULT 1,
        brand_name VARCHAR(50) DEFAULT 'NEW 88',
        brand_tagline VARCHAR(100) DEFAULT 'NƠI CẢM XÚC KHÔNG GIỚI HẠN',
        payout_badge VARCHAR(100) DEFAULT '⚡ NẠP RÚT NHANH CHÓNG 24/7',
        target_url TEXT NOT NULL DEFAULT 'https://new88.com/khuyen-mai-500k',
        remaining_slots INT NOT NULL DEFAULT 147,
        total_slots INT NOT NULL DEFAULT 500,
        event_title TEXT DEFAULT 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền',
        is_auto_redirect BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Created table: site_config');

    await sql`
      INSERT INTO site_config (id, brand_name, brand_tagline, target_url, remaining_slots, total_slots)
      VALUES (1, 'NEW 88', 'NƠI CẢM XÚC KHÔNG GIỚI HẠN', 'https://new88.com/khuyen-mai-500k', 147, 500)
      ON CONFLICT (id) DO NOTHING;
    `;

    // 2. top_events
    await sql`
      CREATE TABLE IF NOT EXISTS top_events (
        id INT PRIMARY KEY DEFAULT 1,
        badge_text VARCHAR(250) DEFAULT '🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
        title VARCHAR(250) DEFAULT 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền',
        subtitle TEXT,
        warning_text TEXT,
        button_text VARCHAR(100) DEFAULT '👇 NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Created table: top_events');

    await sql`
      INSERT INTO top_events (id, badge_text, title)
      VALUES (1, '🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ', 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền')
      ON CONFLICT (id) DO NOTHING;
    `;

    // 3. promotions
    await sql`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        sort_order INT DEFAULT 1,
        icon VARCHAR(10) DEFAULT '🔐',
        subtitle VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        highlight_value VARCHAR(50),
        action_text VARCHAR(50) DEFAULT 'NHẬN NGAY',
        is_active BOOLEAN DEFAULT true
      );
    `;
    console.log('✅ Created table: promotions');

    // 4. admin_users
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Created table: admin_users');

    await sql`
      INSERT INTO admin_users (username, password_hash, role)
      VALUES ('admin', 'admin123', 'admin')
      ON CONFLICT (username) DO NOTHING;
    `;

    // 5. live_transactions
    await sql`
      CREATE TABLE IF NOT EXISTS live_transactions (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        amount VARCHAR(50) NOT NULL,
        time_display VARCHAR(50) DEFAULT 'Vừa xong',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Created table: live_transactions');

    // 6. click_logs
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
    console.log('✅ Created table: click_logs');

    console.log('🎉 ALL 6 TABLES CREATED SUCCESSFULLY ON YOUR NEON POSTGRES DATABASE!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrate();
