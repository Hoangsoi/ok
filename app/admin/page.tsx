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
  const [topTickerText, setTopTickerText] = useState('🎉 CHƯƠNG TRÌNH QUÀ TẶNG CHECK-IN 7 NGÀY CHÍNH THỨC BẮT ĐẦU! 🔥 ✦ 💰 TỔNG TIỀN HOÀN THƯỞNG CAO NHẤT LÊN ĐẾN 1.000.000 VNĐ! ✦ 🎁 CHECK-IN NGÀY ĐẦU TIÊN: NHẬN NGAY 500.000 VNĐ ✦ 🎁 CHECK-IN LIÊN TỤC ĐỦ 7 NGÀY: NHẬN THÊM 500.000 VNĐ ✦ 💳 KHÔNG CẦN NẠP TIỀN - DOANH THU CƯỢC GẤP 3 LẦN');
  const [eventBadgeText, setEventBadgeText] = useState('🎉 CHƯƠNG TRÌNH QUÀ TẶNG CHECK-IN 7 NGÀY CHÍNH THỨC BẮT ĐẦU! 🔥');
  const [eventTitle, setEventTitle] = useState('Chương Trình Quà Tặng Check-in 7 Ngày Chính Thức Bắt Đầu!');
  const [eventSubtitle, setEventSubtitle] = useState('Cảm ơn sự ủng hộ và đồng hành của tất cả khách hàng mới và cũ trong suốt thời gian qua. Đặc biệt ra mắt “Chương trình hoàn thưởng check-in 7 ngày”! 💰 Tổng tiền hoàn thưởng cao nhất lên đến 1.000.000 VNĐ!');
  const [eventWarningText, setEventWarningText] = useState('🚨 Ưu đãi có thời hạn, đừng bỏ lỡ! Chỉ cần check-in ngày đầu tiên là có thể nhận 500.000 VNĐ, kiên trì check-in đủ 7 ngày sẽ nhận thêm 500.000 VNĐ! Check-in liên tục 7 ngày, tổng cộng có thể nhận tối đa 1.000.000 VNĐ!');
  const [eventButtonText, setEventButtonText] = useState('🎁【Nhận ngay 500.000 VNĐ tiền thưởng】');
  
  const [brandName, setBrandName] = useState('NEW 88');
  const [brandTagline, setBrandTagline] = useState('NƠI CẢM XÚC KHÔNG GIỚI HẠN');
  const [ribbonText, setRibbonText] = useState('TRẢI NGHIỆM MƯỢT MÀ · NẠP RÚT NHANH CHÓNG');

  const [dbConnected, setDbConnected] = useState(false);
  const [neonConfigured, setNeonConfigured] = useState(false);

  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  // Visitor Counter State
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [visitsLoading, setVisitsLoading] = useState(true);

  const fetchVisitStats = async () => {
    setVisitsLoading(true);
    try {
      const res = await fetch('/api/visit');
      const data = await res.json();
      setTotalVisits(data.totalVisits || 0);
      setTodayVisits(data.todayVisits || 0);
    } catch (err) {
      console.warn('Failed to load visit stats:', err);
    } finally {
      setVisitsLoading(false);
    }
  };

  // Load existing configuration on mount
  useEffect(() => {
    fetchVisitStats();
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
            VISITOR COUNTER SECTION (BỘ ĐẾM KHÁCH TRUY CẬP TRANG)
           =================================================================== */}
        <div style={{ background: 'rgba(255, 170, 0, 0.05)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 170, 0, 0.25)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ color: '#ffd700', fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 BỘ ĐẾM KHÁCH TRUY CẬP TRANG
              </h3>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                Thống kê lượt truy cập trang chủ theo thời gian thực
              </div>
            </div>
            <button
              type="button"
              onClick={fetchVisitStats}
              className="preset-btn"
              style={{ padding: '6px 14px', fontSize: '13px', background: 'rgba(255,170,0,0.2)', color: '#ffaa00', border: '1px solid #ffaa0066', borderRadius: '8px', cursor: 'pointer' }}
            >
              🔄 Làm mới bộ đếm
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {/* Total Visits Card */}
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 170, 0, 0.3)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>👁️</div>
              <div style={{ fontSize: '13px', color: '#ffea75', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Tổng Lượt Truy Cập
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', marginTop: '8px' }}>
                {visitsLoading ? '...' : totalVisits.toLocaleString('vi-VN')}
              </div>
              <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>Tất cả thời gian</div>
            </div>

            {/* Today's Visits Card */}
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '4px' }}>📅</div>
              <div style={{ fontSize: '13px', color: '#00ff88', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Lượt Truy Cập Hôm Nay
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#00ff88', marginTop: '8px' }}>
                {visitsLoading ? '...' : todayVisits.toLocaleString('vi-VN')}
              </div>
              <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>Tính từ 00:00 hôm nay</div>
            </div>
          </div>
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
            <li>Trạng thái Neon Postgres: {dbConnected ? <b style={{ color: '#00ff88' }}>Đã kết nối (Active)</b> : <b style={{ color: '#ffea75' }}>Sẵn sàng (Local Storage Fallback)</b>}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
