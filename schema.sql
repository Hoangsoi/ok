-- ============================================================
-- NEON POSTGRES DATABASE SCHEMA FOR LANDING PAGE & ADMIN PANEL
-- Project: sites-project (NEW 88 Promotional Landing Page)
-- ============================================================

-- 1. Site Main Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
  id INT PRIMARY KEY DEFAULT 1,
  brand_name VARCHAR(50) DEFAULT 'NEW 88',
  brand_tagline VARCHAR(100) DEFAULT 'NƠI CẢM XÚC KHÔNG GIỚI HẠN',
  payout_badge VARCHAR(100) DEFAULT '⚡ NẠP RÚT NHANH CHÓNG 24/7',
  target_url TEXT NOT NULL DEFAULT 'https://new88.com/khuyen-mai-500k',
  remaining_slots INT NOT NULL DEFAULT 147,
  total_slots INT NOT NULL DEFAULT 500,
  top_ticker_text TEXT DEFAULT '🔥 CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT NĂM: ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial default row for site_config
INSERT INTO site_config (id, brand_name, brand_tagline, target_url, remaining_slots, total_slots)
VALUES (1, 'NEW 88', 'NƠI CẢM XÚC KHÔNG GIỚI HẠN', 'https://new88.com/khuyen-mai-500k', 147, 500)
ON CONFLICT (id) DO NOTHING;

-- 2. Top Event Window Configuration Table
CREATE TABLE IF NOT EXISTS top_events (
  id INT PRIMARY KEY DEFAULT 1,
  badge_text VARCHAR(250) DEFAULT '🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
  title VARCHAR(250) DEFAULT 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền',
  subtitle TEXT DEFAULT 'Đây không phải chương trình nạp tiền, cũng không phải quay thưởng! Bạn có thể đăng ký nhận mà không cần nạp tiền.',
  warning_text TEXT DEFAULT '🚨 Tại sao bạn nên kiểm tra ngay bây giờ? Chương trình lần này áp dụng giới hạn số lượng, không phải lúc nào tất cả mọi người cũng có thể nhận. Chỉ có 500 suất — hết là dừng.',
  button_text VARCHAR(100) DEFAULT '👇 NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial default row for top_events
INSERT INTO top_events (id, badge_text, title)
VALUES (1, '🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ', 'Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền')
ON CONFLICT (id) DO NOTHING;

-- 3. Promotional Cards Table
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

-- Initial seed data for promotions
INSERT INTO promotions (sort_order, icon, subtitle, title, highlight_value, action_text) VALUES
(1, '🔐', 'ƯU ĐÃI THÀNH VIÊN MỚI', 'NẠP ĐẦU TẶNG', '8,888K', 'NHẬN NGAY'),
(2, '📅', 'THỨ 2 NGÀY VÀNG', 'NẠP TẶNG', '5%', 'CHI TIẾT'),
(3, '🎁', 'NGÀY 6 - 16 - 26', 'LÌ XÌ NGHÌN TỶ', '', 'THAM GIA'),
(4, '🤝', 'CHƯƠNG TRÌNH ĐẠI LÝ', 'HỢP TÁC ĐẠI LÝ', '60%', 'ĐĂNG KÝ')
ON CONFLICT DO NOTHING;

-- 4. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, role)
VALUES ('admin', 'admin123', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 5. Live Transactions Ticker Table
CREATE TABLE IF NOT EXISTS live_transactions (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  amount VARCHAR(50) NOT NULL,
  time_display VARCHAR(50) DEFAULT 'Vừa xong',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial transactions
INSERT INTO live_transactions (username, action_type, amount, time_display) VALUES
('thanh***98', 'Nạp tiền', '5.000.000 VNĐ', 'Vừa xong'),
('minh***82', 'Rút tiền thành công', '18.500.000 VNĐ', '1 phút trước'),
('hoang***14', 'Nhận lì xì', '8.888.000 VNĐ', '2 phút trước'),
('viet***09', 'Rút tiền thành công', '50.000.000 VNĐ', '3 phút trước'),
('khanh***55', 'Nạp đầu nhận thưởng', '8.888.000 VNĐ', '5 phút trước')
ON CONFLICT DO NOTHING;

-- 6. Click Tracking Logs Table
CREATE TABLE IF NOT EXISTS click_logs (
  id SERIAL PRIMARY KEY,
  target_url TEXT NOT NULL,
  action_name VARCHAR(100),
  user_agent TEXT,
  ip_address VARCHAR(50),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
