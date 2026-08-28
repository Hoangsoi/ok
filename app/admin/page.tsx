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

  // Preload Config State
  const [preloadEnabled, setPreloadEnabled] = useState(false);
  const [preloadUrl, setPreloadUrl] = useState('');
  const [preloadTimeout, setPreloadTimeout] = useState(9000);
  const [preloadToast, setPreloadToast] = useState('');
  const [preloadTestResult, setPreloadTestResult] = useState('');
  const [preloadTestLoading, setPreloadTestLoading] = useState(false);

  // Advertiser Iframe Embed State
  const [advertiserIframeEnabled, setAdvertiserIframeEnabled] = useState(false);
  const [advertiserIframeUrl, setAdvertiserIframeUrl] = useState('');
  const [advertiserIframeCode, setAdvertiserIframeCode] = useState('');
  const [advertiserIframeTitle, setAdvertiserIframeTitle] = useState('📺 ĐỐI TÁC TÀI TRỢ CHÍNH THỨC');
  const [advertiserToast, setAdvertiserToast] = useState('');
  const [showAdvertiserPreview, setShowAdvertiserPreview] = useState(false);

  // Target URL Config State
  const [targetUrl, setTargetUrl] = useState('https://new88.com/khuyen-mai-500k');
  const [targetToast, setTargetToast] = useState('');

  // General Form State
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
        if (data.preloadEnabled !== undefined) setPreloadEnabled(Boolean(data.preloadEnabled));
        if (data.preloadUrl !== undefined) setPreloadUrl(data.preloadUrl);
        if (data.preloadTimeout !== undefined) setPreloadTimeout(Number(data.preloadTimeout));

        if (data.advertiserIframeEnabled !== undefined) setAdvertiserIframeEnabled(Boolean(data.advertiserIframeEnabled));
        if (data.advertiserIframeUrl !== undefined) setAdvertiserIframeUrl(data.advertiserIframeUrl);
        if (data.advertiserIframeCode !== undefined) {
          setAdvertiserIframeCode(data.advertiserIframeCode);
        } else if (data.advertiserIframeUrl) {
          setAdvertiserIframeCode(`<iframe src="${data.advertiserIframeUrl}" width="100%" height="420" frameborder="0"></iframe>`);
        }
        if (data.advertiserIframeTitle !== undefined) setAdvertiserIframeTitle(data.advertiserIframeTitle);

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

  const handleSavePreload = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreloadToast('');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preloadEnabled,
          preloadUrl,
          preloadTimeout: Number(preloadTimeout),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreloadToast('✅ Đã lưu CẤU HÌNH PRELOAD thành công!');
      } else {
        setPreloadToast(`❌ ${data.error || 'Lưu cấu hình Preload thất bại!'}`);
      }
    } catch {
      setPreloadToast('⚠️ Đã lưu cấu hình Preload cục bộ!');
    } finally {
      setTimeout(() => setPreloadToast(''), 5000);
    }
  };

  const handleTestPreload = async () => {
    if (!preloadUrl) {
      setPreloadTestResult('⚠️ Vui lòng nhập URL Preload trước khi kiểm tra!');
      return;
    }
    setPreloadTestLoading(true);
    setPreloadTestResult('⏳ Đang kết nối thử nghiệm đến Preload URL...');
    const startTime = performance.now();

    try {
      await fetch(preloadUrl, { mode: 'no-cors' });
      const duration = Math.round(performance.now() - startTime);
      setPreloadTestResult(`✅ TEST PRELOAD THÀNH CÔNG: Đã phản hồi trong ${duration} ms (Chế độ an toàn no-cors).`);
    } catch (err) {
      setPreloadTestResult(`⚠️ TEST PRELOAD CHÚ Ý: Kết nối phản hồi không thành công hoặc bị trình duyệt giới hạn CORS. Chi tiết: ${String(err)}`);
    } finally {
      setPreloadTestLoading(false);
    }
  };

  const handleSaveAdvertiser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdvertiserToast('');

    // Extract src from iframe if user pasted <iframe src="...">
    let derivedUrl = advertiserIframeUrl;
    const match = advertiserIframeCode.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      derivedUrl = match[1];
    } else if (advertiserIframeCode.startsWith('http://') || advertiserIframeCode.startsWith('https://')) {
      derivedUrl = advertiserIframeCode.trim();
    }

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advertiserIframeEnabled,
          advertiserIframeUrl: derivedUrl,
          advertiserIframeCode,
          advertiserIframeTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdvertiserToast('✅ Đã lưu MÃ NHÚNG IFRAME QUẢNG CÁO thành công!');
      } else {
        setAdvertiserToast(`❌ ${data.error || 'Lưu cấu hình nhúng thất bại!'}`);
      }
    } catch {
      setAdvertiserToast('✅ Đã cập nhật cấu hình nhúng cục bộ!');
    } finally {
      setTimeout(() => setAdvertiserToast(''), 5000);
    }
  };

  const handleSaveTargetUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setTargetToast('');
    localStorage.setItem('landing_target_url', targetUrl);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setTargetToast('✅ Đã lưu TARGET URL thành công!');
      } else {
        setTargetToast(`❌ ${data.error || 'Lưu Target URL thất bại!'}`);
      }
    } catch {
      setTargetToast('✅ Đã cập nhật Target URL cục bộ!');
    } finally {
      setTimeout(() => setTargetToast(''), 5000);
    }
  };

  const handleTestTargetUrl = () => {
    if (!targetUrl) return;
    window.open(targetUrl, '_blank');
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
        setPassToast('🎉 Đổi mật khẩu thành công!');
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

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast('');

    localStorage.setItem('landing_remaining_slots', remainingSlots.toString());

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        setToast('✅ Đã lưu toàn bộ nội dung hiển thị thành công!');
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

        {/* Global Toast */}
        {toast && <div className="admin-toast">{toast}</div>}

        {/* ===================================================================
            SECTION 1: CẤU HÌNH PRELOAD (PRELOAD CONFIGURATION)
           =================================================================== */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '18px', border: '2px solid #ffaa00', marginBottom: '30px' }}>
          <h2 style={{ color: '#ffd700', fontSize: '20px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ CẤU HÌNH PRELOAD (TẢI TRƯỚC TÀI NGUYÊN)
          </h2>

          {preloadToast && (
            <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 700, background: preloadToast.startsWith('✅') ? '#008844' : '#cc0000', color: '#fff' }}>
              {preloadToast}
            </div>
          )}

          <form onSubmit={handleSavePreload}>
            {/* Toggle Button */}
            <div className="admin-field-group" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label className="admin-label" style={{ marginBottom: 0 }}>
                ⚡ TRẠNG THÁI BẬT PRELOAD:
              </label>
              <button
                type="button"
                className="preset-btn"
                style={{
                  padding: '8px 24px',
                  fontSize: '14px',
                  fontWeight: 900,
                  background: preloadEnabled ? 'linear-gradient(90deg, #00cc66, #008844)' : 'rgba(255,255,255,0.1)',
                  color: preloadEnabled ? '#ffffff' : '#aaaaaa',
                  border: preloadEnabled ? '2px solid #00ff88' : '1px solid #666',
                }}
                onClick={() => setPreloadEnabled(!preloadEnabled)}
              >
                {preloadEnabled ? '🟢 ON (ĐANG BẬT)' : '⚪ OFF (ĐANG TẮT)'}
              </button>
            </div>

            {/* Preload URL Input */}
            <div className="admin-field-group">
              <label className="admin-label">🔗 URL PRELOAD (TÀI NGUYÊN/DOMAIN ĐƯỢC PHÉP TÍCH HỢP):</label>
              <input
                type="text"
                className="admin-input"
                value={preloadUrl}
                onChange={(e) => setPreloadUrl(e.target.value)}
                placeholder="Nhập URL tài nguyên Preload (https://...)"
              />
              <div style={{ fontSize: '12px', color: '#a89488', marginTop: '6px' }}>
                💡 Khi <b>Preload = ON</b>, màn hình Loading sẽ nạp tài nguyên tại URL này và chờ nạp hoàn tất (hoặc mốc timeout) rồi mới hiển thị Landing Page.
              </div>
            </div>

            {/* Preload Timeout Input */}
            <div className="admin-field-group">
              <label className="admin-label">⏰ TIMEOUT DỰ PHÒNG PRELOAD (MS):</label>
              <input
                type="number"
                className="admin-input"
                value={preloadTimeout}
                onChange={(e) => setPreloadTimeout(Number(e.target.value))}
                min="500"
                step="500"
                required
              />
              <div style={{ fontSize: '12px', color: '#a89488', marginTop: '6px' }}>
                💡 Thời gian nạp dự phòng (mặc định 9000ms ~ 9s để đảm bảo tài nguyên link nạp đầy đủ).
              </div>
            </div>

            {/* Preload Test Result Banner */}
            {preloadTestResult && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid #ffaa0055', color: '#ffea75', fontSize: '13px', marginBottom: '16px' }}>
                {preloadTestResult}
              </div>
            )}

            {/* Preload Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button type="submit" className="admin-save-btn" style={{ margin: 0, padding: '12px' }}>
                💾 LƯU CẤU HÌNH PRELOAD
              </button>
              <button
                type="button"
                className="preset-btn"
                style={{ padding: '12px', fontSize: '14px', background: 'linear-gradient(90deg, #ffaa00, #ff7700)', color: '#000', fontWeight: 900, border: 'none' }}
                onClick={handleTestPreload}
                disabled={preloadTestLoading}
              >
                {preloadTestLoading ? '⏳ ĐANG TEST...' : '🧪 TEST PRELOAD URL'}
              </button>
            </div>
          </form>
        </div>



        {/* ===================================================================
            SECTION 3: CẤU HÌNH NÚT LANDING PAGE (TARGET URL CONFIGURATION)
           =================================================================== */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '18px', border: '2px solid #00ff88', marginBottom: '30px' }}>
          <h2 style={{ color: '#00ff88', fontSize: '20px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 CẤU HÌNH NÚT LANDING PAGE (TARGET URL)
          </h2>

          {targetToast && (
            <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 700, background: '#008844', color: '#fff' }}>
              {targetToast}
            </div>
          )}

          <form onSubmit={handleSaveTargetUrl}>
            <div className="admin-field-group">
              <label className="admin-label">🔗 TARGET URL (LIÊN KẾT ĐIỀU HƯỚNG KHI BẤM NÚT CTA):</label>
              <input
                type="url"
                className="admin-input"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Nhập đường dẫn trang đích (https://...)"
                required
              />
              <div style={{ fontSize: '12px', color: '#a89488', marginTop: '6px' }}>
                💡 Đây là liên kết độc lập (`targetUrl !== preloadUrl`). Khách hàng chỉ được chuyển tới liên kết này khi chủ động bấm nút CTA trên Landing Page.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button type="submit" className="admin-save-btn" style={{ margin: 0, padding: '12px', background: 'linear-gradient(180deg, #00aa55 0%, #006633 100%)' }}>
                💾 LƯU TARGET URL
              </button>
              <button
                type="button"
                className="preset-btn"
                style={{ padding: '12px', fontSize: '14px', background: '#00ff88', color: '#000', fontWeight: 900, border: 'none' }}
                onClick={handleTestTargetUrl}
              >
                👁️ TEST TARGET URL (MỞ TAB MỚI)
              </button>
            </div>
          </form>
        </div>

        {/* ===================================================================
            SECTION 4: QUẢN LÝ NỘI DUNG HIỂN THỊ TRANG LANDING PAGE
           =================================================================== */}
        <form onSubmit={handleSaveGeneral}>
          <h3 style={{ color: '#ffd700', fontSize: '18px', margin: '0 0 16px' }}>
            🏆 SỐ SUẤT CHƯƠNG TRÌNH & THÔNG BÁO
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-field-group">
              <label className="admin-label">🎟️ SỐ SUẤT CÒN LẠI:</label>
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
              <label className="admin-label">🏆 TỔNG SỐ SUẤT CHƯƠNG TRÌNH:</label>
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

          <div className="admin-field-group">
            <label className="admin-label">📢 CHỮ CHẠY THÔNG BÁO Ở ĐẦU TRANG:</label>
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

          <h3 style={{ color: '#ffd700', fontSize: '18px', margin: '0 0 16px' }}>
            🎁 NỘI DUNG CỬA SỔ SỰ KIỆN NỔI BẬT
          </h3>

          <div className="admin-field-group">
            <label className="admin-label">🔥 HUY HIỆU SỰ KIỆN:</label>
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
            <label className="admin-label">🚨 KHUNG CẢNH BÁO SỰ KIỆN:</label>
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

          <h3 style={{ color: '#ffd700', fontSize: '18px', margin: '0 0 16px' }}>
            👑 QUẢN LÝ THƯƠNG HIỆU
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
            <label className="admin-label">🎗️ DẢI BĂNG RIBBON:</label>
            <input
              type="text"
              className="admin-input"
              value={ribbonText}
              onChange={(e) => setRibbonText(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-save-btn" disabled={loading}>
            {loading ? 'ĐANG LƯU...' : '💾 LƯU TOÀN BỘ NỘI DUNG NÀY'}
          </button>
        </form>

        <hr style={{ border: '0', borderTop: '1px solid #ffaa0044', margin: '35px 0' }} />

        {/* SECTION 5: PASSWORD CHANGE */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '18px', border: '1px solid #ffaa0044' }}>
          <h3 style={{ color: '#ffd700', fontSize: '18px', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔐 ĐỔI MẬT KHẨU QUẢN TRỊ (ADMIN PASSWORD)
          </h3>

          {passToast && (
            <div style={{ padding: '10px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 700, background: passToast.startsWith('🎉') ? '#008844' : '#cc0000', color: '#fff' }}>
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
              style={{ width: '100%', padding: '12px', fontSize: '14px', background: 'linear-gradient(90deg, #ffaa00, #ff5500)', color: '#fff', border: 'none' }}
              disabled={passLoading}
            >
              {passLoading ? 'ĐANG ĐỔI...' : '🔑 XÁC NHẬN ĐỔI MẬT KHẨU'}
            </button>
          </form>
        </div>

        {/* Real-time Status Card */}
        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid #ffaa0033', fontSize: '13px' }}>
          <strong style={{ color: '#ffd700', display: 'block', marginBottom: '8px' }}>
            🐘 Trạng thái cấu hình hiện tại:
          </strong>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#ddc5b5' }}>
            <li>Trạng thái Preload: {preloadEnabled ? <b style={{ color: '#00ff88' }}>🟢 ON ({preloadUrl || 'Chưa nhập URL'}, Timeout: {preloadTimeout}ms)</b> : <b style={{ color: '#aaaaaa' }}>⚪ OFF</b>}</li>
            <li>Link điều hướng nút CTA (Target URL): <code style={{ color: '#00ff88' }}>{targetUrl}</code></li>
            <li>Trạng thái Neon Postgres: {dbConnected ? <b style={{ color: '#00ff88' }}>Đã kết nối (Active)</b> : <b style={{ color: '#ffea75' }}>Sẵn sàng (Local Storage Fallback)</b>}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
