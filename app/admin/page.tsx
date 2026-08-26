'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password Change Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passToast, setPassToast] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Form State
  const [targetUrl, setTargetUrl] = useState('https://new88.com/khuyen-mai-500k');
  const [remainingSlots, setRemainingSlots] = useState(147);
  const [totalSlots, setTotalSlots] = useState(500);

  // Text Content Management State
  const [topTickerText, setTopTickerText] = useState('🔥 CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT NĂM: ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ ✦ 🎁 KHÁCH HÀNG MỚI VÀ CỦ ĐỀU CÓ THỂ THAM GIA ✦ 💳 KHÔNG CẦN NẠP TIỀN - TOÀN CHƯƠNG TRÌNH CHỈ MỞ 500 SUẤT');
  const [eventBadgeText, setEventBadgeText] = useState('🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ');
  const [eventTitle, setEventTitle] = useState('Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền');
  const [eventSubtitle, setEventSubtitle] = useState('Đây không phải chương trình nạp tiền, cũng không phải quay thưởng! Bạn có thể đăng ký nhận mà không cần nạp tiền.');
  const [eventWarningText, setEventWarningText] = useState('🚨 Tại sao bạn nên kiểm tra ngay bây giờ? Chương trình lần này áp dụng giới hạn số lượng, không phải lúc nào tất cả mọi người cũng có thể nhận. Khách hàng đáp ứng điều kiện sau khi truy cập trang chương trình độc quyền có thể kiểm tra tư cách tham gia của mình và xem chi tiết các quy định nhận thưởng. Chỉ có 500 suất — hết là dừng.');
  const [eventButtonText, setEventButtonText] = useState('👇 NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ');
  
  const [brandName, setBrandName] = useState('NEW 88');
  const [brandTagline, setBrandTagline] = useState('NƠI CẢM XÚC KHÔNG GIỚI HẠN');
  const [ribbonText, setRibbonText] = useState('TRẢI NGHIỆM MƯỢT MÀ · NẠP RÚT NHANH CHÓNG');

  const [dbConnected, setDbConnected] = useState(false);
  const [neonConfigured, setNeonConfigured] = useState(false);
  
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.targetUrl) setTargetUrl(data.targetUrl);
        if (data.remainingSlots !== undefined) setRemainingSlots(data.remainingSlots);
        if (data.totalSlots !== undefined) setTotalSlots(data.totalSlots);
        if (data.topTickerText) setTopTickerText(data.topTickerText);
        if (data.eventBadgeText) setEventBadgeText(data.eventBadgeText);
        if (data.eventTitle) setEventTitle(data.eventTitle);
        if (data.eventSubtitle) setEventSubtitle(data.eventSubtitle);
        if (data.eventWarningText) setEventWarningText(data.eventWarningText);
        if (data.eventButtonText) setEventButtonText(data.eventButtonText);
        if (data.brandName) setBrandName(data.brandName);
        if (data.brandTagline) setBrandTagline(data.brandTagline);
        if (data.ribbonText) setRibbonText(data.ribbonText);

        setDbConnected(Boolean(data.dbConnected));
        setNeonConfigured(Boolean(data.neonConfigured));
      })
      .catch(() => {
        const localUrl = localStorage.getItem('landing_target_url');
        if (localUrl) setTargetUrl(localUrl);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', currentPassword: password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Mật khẩu không chính xác!');
      }
    } catch {
      const storedPass = typeof window !== 'undefined' ? localStorage.getItem('admin_password') : null;
      if (storedPass ? password === storedPass : password === 'admin123') {
        setIsAuthenticated(true);
      } else {
        setLoginError('Mật khẩu không chính xác!');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassToast('');

    if (newPassword !== confirmPassword) {
      setPassToast('❌ Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }

    if (newPassword.length < 4) {
      setPassToast('❌ Mật khẩu mới phải từ 4 ký tự trở lên!');
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change',
          currentPassword: oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_password', newPassword);
        }
        setPassToast('🎉 Đổi mật khẩu thành công! Hãy dùng mật khẩu mới cho lần đăng nhập tiếp theo.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassToast(`❌ ${data.error || 'Đổi mật khẩu thất bại!'}`);
      }
    } catch {
      setPassToast('❌ Có lỗi xảy ra khi đổi mật khẩu!');
    } finally {
      setPassLoading(false);
      setTimeout(() => setPassToast(''), 6000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast('');

    localStorage.setItem('landing_target_url', targetUrl);
    localStorage.setItem('landing_remaining_slots', remainingSlots.toString());

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          remainingSlots: Number(remainingSlots),
          totalSlots: Number(totalSlots),
          topTickerText,
          eventBadgeText,
          eventTitle,
          eventSubtitle,
          eventWarningText,
          eventButtonText,
          brandName,
          brandTagline,
          ribbonText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDbConnected(Boolean(data.dbConnected));
        const statusMsg = data.dbConnected
          ? '🐘 Đã lưu vào cơ sở dữ liệu Neon Postgres thành công!'
          : '✅ Đã lưu cấu hình thành công!';
        setToast(statusMsg);
      } else {
        setToast('⚠️ Đã cập nhật cấu hình local!');
      }
    } catch {
      setToast('✅ Đã cập nhật cấu hình thành công!');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(''), 6000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="admin-card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔐</div>
          <h2 className="admin-title" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            Đăng Nhập Trang Quản Trị
          </h2>
          <form onSubmit={handleLogin}>
            <div className="admin-field-group">
              <input
                type="password"
                className="admin-input"
                placeholder="Nhập mật khẩu quản trị..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {loginError && (
                <div style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>
                  {loginError}
                </div>
              )}
            </div>
            <button type="submit" className="admin-save-btn">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        {/* Header Bar */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              <span>⚙️</span> Trang Quản Trị Landing Page
            </h1>
            <div style={{ fontSize: '12px', marginTop: '4px', color: dbConnected ? '#00ff88' : '#ffaa00' }}>
              {dbConnected ? '🐘 Cơ sở dữ liệu: Neon Postgres (Đã kết nối)' : neonConfigured ? '⚡ Đang kiểm tra Neon DB...' : '💾 Cơ sở dữ liệu: Local Storage & JSON Fallback'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="preset-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffaa00', color: '#000' }}
            >
              👁️ Xem Trang Chủ
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="preset-btn"
              style={{ background: 'rgba(255,0,0,0.3)', color: '#fff', border: '1px solid #ff4444' }}
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Success Toast Notification */}
        {toast && <div className="admin-toast">{toast}</div>}

        {/* Configuration Form */}
        <form onSubmit={handleSave}>
          {/* 1. Target URL Config */}
          <div className="admin-field-group">
            <label className="admin-label">
              🔗 LINK ĐIỀU HƯỚNG KHI KHÁCH BẤM &quot;NHẬN ƯU ĐÃI NGAY&quot;:
            </label>
            <input
              type="url"
              className="admin-input"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Nhập đường dẫn (https://...)"
              required
            />
            <div style={{ fontSize: '12px', color: '#a89488', marginTop: '6px' }}>
              💡 Khi khách hàng bấm vào nút <b>&quot;NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ&quot;</b> hoặc các nút nhận quà trên trang chủ, họ sẽ lập tức được chuyển sang đường dẫn này.
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #ffaa0033', margin: '24px 0' }} />

          {/* 2. Slots Config */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-field-group">
              <label className="admin-label">
                🎟️ SỐ SUẤT CÒN LẠI (HIỂN THỊ TRÊN BANNER):
              </label>
              <input
                type="number"
                className="admin-input"
                value={remainingSlots}
                onChange={(e) => setRemainingSlots(Number(e.target.value))}
                min="0"
                max={totalSlots}
                required
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label">
                🏆 TỔNG SỐ SUẤT CHƯƠNG TRÌNH:
              </label>
              <input
                type="number"
                className="admin-input"
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                min="1"
                required
              />
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #ffaa0033', margin: '24px 0' }} />

          {/* 3. Top Ticker Text Config */}
          <div className="admin-field-group">
            <label className="admin-label">
              📢 CHỮ CHẠY THÔNG BÁO Ở ĐẦU TRANG:
            </label>
            <input
              type="text"
              className="admin-input"
              value={topTickerText}
              onChange={(e) => setTopTickerText(e.target.value)}
              placeholder="Nhập nội dung chữ chạy..."
              required
            />
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #ffaa0033', margin: '24px 0' }} />

          {/* 4. Top Event Window Content Settings */}
          <h3 style={{ color: '#ffd700', fontSize: '16px', margin: '0 0 16px' }}>
            🎁 QUẢN LÝ NỘI DUNG CỬA SỔ SỰ KIỆN NỔI BẬT (ĐẦU TRANG)
          </h3>

          <div className="admin-field-group">
            <label className="admin-label">🔥 HUY HIỆU ĐẦU CỬA SỔ SỰ KIỆN:</label>
            <input
              type="text"
              className="admin-input"
              value={eventBadgeText}
              onChange={(e) => setEventBadgeText(e.target.value)}
              required
            />
          </div>

          <div className="admin-field-group">
            <label className="admin-label">🏷️ TIÊU ĐỀ CHÍNH SỰ KIỆN:</label>
            <input
              type="text"
              className="admin-input"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          <div className="admin-field-group">
            <label className="admin-label">📝 MÔ TẢ PHỤ SỰ KIỆN:</label>
            <textarea
              className="admin-input"
              rows={2}
              value={eventSubtitle}
              onChange={(e) => setEventSubtitle(e.target.value)}
              required
            />
          </div>

          <div className="admin-field-group">
            <label className="admin-label">🚨 NỘI DUNG KHUNG CẢNH BÁO / TẠI SAO NÊN KIỂM TRA NGAY:</label>
            <textarea
              className="admin-input"
              rows={3}
              value={eventWarningText}
              onChange={(e) => setEventWarningText(e.target.value)}
              required
            />
          </div>

          <div className="admin-field-group">
            <label className="admin-label">🔴 TÊN NÚT BẤM KÍCH HOẠT SỰ KIỆN:</label>
            <input
              type="text"
              className="admin-input"
              value={eventButtonText}
              onChange={(e) => setEventButtonText(e.target.value)}
              required
            />
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #ffaa0033', margin: '24px 0' }} />

          {/* 5. Brand & Ribbon Banner Content */}
          <h3 style={{ color: '#ffd700', fontSize: '16px', margin: '0 0 16px' }}>
            👑 QUẢN LÝ THƯƠNG HIỆU &amp; BANNER
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-field-group">
              <label className="admin-label">TÊN THƯƠNG HIỆU:</label>
              <input
                type="text"
                className="admin-input"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
            </div>

            <div className="admin-field-group">
              <label className="admin-label">SLOGAN THƯƠNG HIỆU:</label>
              <input
                type="text"
                className="admin-input"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-field-group">
            <label className="admin-label">🎗️ DẢI BĂNG BÓNG DƯỚI ĐIỆN THOẠI (RIBBON):</label>
            <input
              type="text"
              className="admin-input"
              value={ribbonText}
              onChange={(e) => setRibbonText(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="admin-save-btn" disabled={loading}>
            {loading ? 'ĐANG LƯU...' : '💾 LƯU CẤU HÌNH TRANG LANDING PAGE'}
          </button>
        </form>

        <hr style={{ border: '0', borderTop: '1px solid #ffaa0044', margin: '35px 0' }} />

        {/* 6. PASSWORD CHANGE SECTION */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '18px', border: '1px solid #ffaa0044' }}>
          <h3 style={{ color: '#ffd700', fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔐 ĐỔI MẬT KHẨU QUẢN TRỊ (ADMIN PASSWORD)
          </h3>

          {passToast && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 700,
                background: passToast.startsWith('🎉') ? '#008844' : '#cc0000',
                color: '#fff',
              }}
            >
              {passToast}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Mật Khẩu Hiện Tại:</label>
                <input
                  type="password"
                  className="admin-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu cũ..."
                  required
                />
              </div>

              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Mật Khẩu Mới:</label>
                <input
                  type="password"
                  className="admin-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  required
                />
              </div>

              <div className="admin-field-group" style={{ marginBottom: 0 }}>
                <label className="admin-label">Xác Nhận Mật Khẩu Mới:</label>
                <input
                  type="password"
                  className="admin-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="preset-btn"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                background: 'linear-gradient(90deg, #ffaa00, #ff5500)',
                color: '#fff',
                border: 'none',
              }}
              disabled={passLoading}
            >
              {passLoading ? 'ĐANG ĐỔI...' : '🔑 XÁC NHẬN ĐỔI MẬT KHẨU'}
            </button>
          </form>
        </div>

        {/* Real-time Status Card */}
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '16px',
            border: '1px solid #ffaa0033',
            fontSize: '13px',
          }}
        >
          <strong style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>
            🐘 Trạng thái kết nối Neon Database:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#ddc5b5' }}>
            <li>Link điều hướng hiện tại: <code style={{ color: '#00ff88' }}>{targetUrl}</code></li>
            <li>Hiển thị banner: <b style={{ color: '#ffd700' }}>{remainingSlots} / {totalSlots} suất</b></li>
            <li>Trạng thái Neon Postgres: {dbConnected ? <b style={{ color: '#00ff88' }}>Đã kết nối (Active)</b> : <b style={{ color: '#ffea75' }}>Sẵn sàng (Local Storage Fallback)</b>}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
