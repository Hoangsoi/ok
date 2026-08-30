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
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [modalIcon, setModalIcon] = useState('🎁');
  const [modalActionBtnText, setModalActionBtnText] = useState('XÁC NHẬN NHẬN THƯỞNG');
  const [modalUsername, setModalUsername] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
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
  const [topTickerText, setTopTickerText] = useState('🎉 CHƯƠNG TRÌNH QUÀ TẶNG CHECK-IN 7 NGÀY CHÍNH THỨC BẮT ĐẦU! 🔥 ✦ 💰 TỔNG TIỀN HOÀN THƯỞNG CAO NHẤT LÊN ĐẾN 1.000.000 VNĐ! ✦ 🎁 CHECK-IN NGÀY ĐẦU TIÊN: NHẬN NGAY 500.000 VNĐ ✦ 🎁 CHECK-IN LIÊN TỤC ĐỦ 7 NGÀY: NHẬN THÊM 500.000 VNĐ ✦ 💳 KHÔNG CẦN NẠP TIỀN - DOANH THU CƯỢC GẤP 3 LẦN');
  const [eventBadgeText, setEventBadgeText] = useState('🎉 CHƯƠNG TRÌNH QUÀ TẶNG CHECK-IN 7 NGÀY CHÍNH THỨC BẮT ĐẦU! 🔥');
  const [eventTitle, setEventTitle] = useState('Chương Trình Quà Tặng Check-in 7 Ngày Chính Thức Bắt Đầu!');
  const [eventSubtitle, setEventSubtitle] = useState('Cảm ơn sự ủng hộ và đồng hành của tất cả khách hàng mới và cũ trong suốt thời gian qua. Đặc biệt ra mắt “Chương trình hoàn thưởng check-in 7 ngày”! 💰 Tổng tiền hoàn thưởng cao nhất lên đến 1.000.000 VNĐ!');
  const [eventWarningText, setEventWarningText] = useState('🚨 Ưu đãi có thời hạn, đừng bỏ lỡ! Chỉ cần check-in ngày đầu tiên là có thể nhận 500.000 VNĐ, kiên trì check-in đủ 7 ngày sẽ nhận thêm 500.000 VNĐ! Check-in liên tục 7 ngày, tổng cộng có thể nhận tối đa 1.000.000 VNĐ!');
  const [eventButtonText, setEventButtonText] = useState('🎁【Nhận ngay 500.000 VNĐ tiền thưởng】');
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

      setLoadProgress(10);
      setLoadStatusText('Đang nạp dữ liệu hệ thống...');

      // 1. Chờ iframe trong entry nạp xong (hoặc fallback tối đa 10 giây nếu mạng chậm/bị chặn)
      const iframeLoadPromise = new Promise<void>((resolve) => {
        if (typeof window !== 'undefined' && (window as unknown as Record<string, boolean>).__entryIframeLoaded) {
          resolve();
          return;
        }

        let isDone = false;
        const handleDone = () => {
          if (isDone) return;
          isDone = true;
          if (typeof window !== 'undefined') {
            window.removeEventListener('entry_iframe_loaded', handleDone);
          }
          resolve();
        };

        if (typeof window !== 'undefined') {
          window.addEventListener('entry_iframe_loaded', handleDone);
          const iframeEl = document.getElementById('entry-iframe') as HTMLIFrameElement | null;
          if (iframeEl) {
            iframeEl.addEventListener('load', handleDone, { once: true });
          }
        }

        setTimeout(() => {
          if (!isDone) handleDone();
        }, 10000);
      });

      await iframeLoadPromise;

      // 2. Iframe đã nạp xong! Đếm ngược đúng 10s (10,000ms) trước khi vào Landing Page
      setLoadProgress(30);
      const TEN_SECONDS_MS = 10000;
      const startTime10s = Date.now();

      const countdownInterval = setInterval(() => {
        if (!isMounted) return;
        const elapsed = Date.now() - startTime10s;
        const ratio = Math.min(1, elapsed / TEN_SECONDS_MS);
        const currentProgress = Math.min(99, Math.floor(30 + ratio * 69));
        const secondsLeft = Math.max(0, Math.ceil((TEN_SECONDS_MS - elapsed) / 1000));

        setLoadProgress(currentProgress);
        setLoadStatusText(`Đang chuyển hướng vào trang chủ (${secondsLeft}s)...`);
      }, 150);

      await new Promise((resolve) => setTimeout(resolve, TEN_SECONDS_MS));
      clearInterval(countdownInterval);

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

  // User clicks CTA button -> Opens interactive realistic Modal Popup tailored to promotion
  const openAction = (title: string) => {
    setModalUsername('');
    setModalPhone('');
    setModalLoading(false);
    setModalSuccess(false);

    if (title.includes('500.000') || title.includes('1.000.000') || title.includes('Check-in') || title.includes('check-in') || title.includes('Ưu Đãi Độc Quyền')) {
      setModalIcon('🎁');
      setModalTitle('NHẬN NGAY 500.000 VNĐ TIỀN THƯỞNG CHECK-IN');
      setModalSubtitle('Check-in ngày đầu tiên nhận 500.000 VNĐ, check-in đủ 7 ngày nhận thêm 500.000 VNĐ (Tổng tối đa 1.000.000 VNĐ). Doanh thu cược x3 là có thể rút tiền!');
      setModalActionBtnText('👉 XÁC NHẬN NHẬN 500.000 VNĐ');
    } else if (title.includes('Nạp Đầu') || title.includes('8,888K')) {
      setModalIcon('🔐');
      setModalTitle('ƯU ĐÃI THÀNH VIÊN MỚI - NẠP ĐẦU TẶNG 8,888K');
      setModalSubtitle('Khuyến mãi dành riêng cho tài khoản đăng ký mới nạp tiền lần đầu tiên.');
      setModalActionBtnText('👉 NHẬN NGAY 8,888K');
    } else if (title.includes('Thứ 2') || title.includes('5%')) {
      setModalIcon('📅');
      setModalTitle('THỨ 2 NGÀY VÀNG - NẠP TẶNG 5%');
      setModalSubtitle('Thành viên nạp tiền vào Thứ 2 hàng tuần được cộng thưởng 5% không giới hạn.');
      setModalActionBtnText('👉 KÍCH HOẠT ƯU ĐÃI THỨ 2');
    } else if (title.includes('Lì Xì') || title.includes('6 - 16 - 26') || title.includes('6-16-26')) {
      setModalIcon('🧧');
      setModalTitle('SỰ KIỆN LÌ XÌ NGHÌN TỶ (NGÀY 6 - 16 - 26)');
      setModalSubtitle('Hệ thống tự động phát lì xì may mắn ngẫu nhiên vào 20:00 cho tất cả thành viên.');
      setModalActionBtnText('👉 THAM GIA ĐĂNG KÝ NHẬN LÌ XÌ');
    } else if (title.includes('Đại Lý') || title.includes('60%')) {
      setModalIcon('🤝');
      setModalTitle('CHƯƠNG TRÌNH HỢP TÁC ĐẠI LÝ HOA HỒNG 60%');
      setModalSubtitle('Đăng ký trở thành đối tác đại lý chính thức với mức hoa hồng lợi nhuận 60% hàng tháng.');
      setModalActionBtnText('👉 ĐĂNG KÝ HỢP TÁC ĐẠI LÝ 60%');
    } else {
      setModalIcon('⚡');
      setModalTitle(title);
      setModalSubtitle('Vui lòng nhập tên tài khoản của bạn để xác nhận tham gia chương trình.');
      setModalActionBtnText('👉 XÁC NHẬN THAM GIA');
    }

    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalUsername.trim()) {
      alert('Vui lòng nhập tên tài khoản game của bạn!');
      return;
    }

    setModalLoading(true);

    const freshTargetUrl = (typeof window !== 'undefined' && localStorage.getItem('landing_target_url')) || targetUrl;

    // Send click & user claim details to backend
    fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: freshTargetUrl,
        action: modalTitle,
        username: modalUsername,
        phone: modalPhone
      }),
    }).catch(() => {});

    // Simulate verification delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setModalLoading(false);
    setModalSuccess(true);

    // Auto redirect customer to target URL after 1.2s
    setTimeout(() => {
      if (freshTargetUrl) {
        window.location.href = freshTargetUrl;
      }
    }, 1200);
  };

  return (
    <>
      {/* Fullscreen Loading Screen (Covers page 100% while link/iframe loads in background) */}
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

              <div className="event-highlight-money-banner">
                <span className="money-icon">💰</span>
                <span className="money-text">
                  Tổng tiền hoàn thưởng cao nhất lên đến <strong className="money-amount">1.000.000 VNĐ!</strong>
                </span>
              </div>

              <div className="top-event-subtitle">
                {eventSubtitle}
              </div>

              <div className="event-bullets-grid">
                <div className="event-bullet-item">
                  <span>📅</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Ngày Check-in Thứ 1</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>💰 Nhận 500.000 VNĐ · 🔄 Cược x3 · ⚡ Đủ điều kiện đăng ký rút tiền</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>📅</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Check-in Liên Tục Đủ 7 Ngày</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>💰 Nhận thêm 500.000 VNĐ · 🔄 Cược x3 · ⚡ Đủ điều kiện đăng ký rút tiền</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>💰</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Tổng Thưởng Tối Đa 1.000.000 VNĐ</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Check-in liên tục 7 ngày nhận tối đa 1.000.000 VNĐ</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>💳</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Không Cần Nạp Tiền</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Chỉ cần hoàn thành doanh thu cược gấp 3 lần là có thể rút tiền</small>
                  </div>
                </div>

                <div className="event-bullet-item">
                  <span>👑</span>
                  <div>
                    <div style={{ color: '#ffd700' }}>Khách Hàng Mới &amp; Cũ</div>
                    <small style={{ color: '#ccc', fontWeight: 'normal' }}>Tất cả khách hàng mới và cũ đều có thể tham gia</small>
                  </div>
                </div>
              </div>

              <div className="event-warning-box">
                {eventWarningText}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#ffea75', fontWeight: 700, marginBottom: '10px' }}>
                  👇 Nhấp vào đường dẫn dành riêng để nhận ngay ưu đãi check-in của bạn
                </div>
                <button 
                  className="event-cta-btn" 
                  onClick={() => openAction('Nhận ngay 500.000 VNĐ tiền thưởng')}
                >
                  {eventButtonText}
                </button>
              </div>

              <div className="event-disclaimer">
                *Điều kiện tham gia cụ thể, quy định check-in, yêu cầu doanh thu cược và điều kiện rút tiền sẽ căn cứ theo nội dung được công bố trên trang chương trình.
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

        {/* 8. Realistic Interactive Modal Popup */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', background: 'linear-gradient(180deg, #1f0d04 0%, #0d0502 100%)', border: '2px solid #ffaa00', borderRadius: '20px', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ color: '#ffaa00', fontSize: '20px' }}>✕</button>
              
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '50px', marginBottom: '6px' }}>{modalIcon}</div>
                <h3 style={{ fontSize: '18px', color: '#ffd700', margin: '0 0 8px', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.3 }}>{modalTitle}</h3>
                <p style={{ color: '#ddc5b5', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                  {modalSubtitle}
                </p>
              </div>

              {modalSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 10px', background: 'rgba(0,255,136,0.1)', borderRadius: '14px', border: '1px solid #00ff88' }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
                  <h4 style={{ color: '#00ff88', margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>ĐĂNG KÝ THÀNH CÔNG!</h4>
                  <p style={{ color: '#ffffff', fontSize: '13px', margin: '0 0 12px' }}>
                    Đã ghi nhận yêu cầu nhận thưởng cho tài khoản <strong style={{ color: '#ffd700' }}>{modalUsername}</strong>.
                  </p>
                  <div style={{ fontSize: '12px', color: '#aaffcc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span className="animate-spin">⏳</span> Đang chuyển hướng bạn tới trang chủ chính thức...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleModalSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', color: '#ffd700', fontSize: '12px', fontWeight: 800, marginBottom: '6px', textAlign: 'left' }}>
                      👤 TÊN TÀI KHOẢN GAME (<span style={{ color: '#ff4444' }}>*</span>):
                    </label>
                    <input
                      type="text"
                      required
                      value={modalUsername}
                      onChange={(e) => setModalUsername(e.target.value)}
                      placeholder="Nhập tên tài khoản game..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid #ffaa0066',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', color: '#ddc5b5', fontSize: '12px', fontWeight: 700, marginBottom: '6px', textAlign: 'left' }}>
                      📞 SỐ ĐIỆN THOẠI / ZALO (KHÔNG BẮT BUỘC):
                    </label>
                    <input
                      type="text"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder="Nhập số điện thoại nhận thông báo..."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid #ffaa0044',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="card-action-btn"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: 900,
                      background: 'linear-gradient(180deg, #ffaa00 0%, #cc7700 100%)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: modalLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 15px rgba(255,170,0,0.4)',
                    }}
                  >
                    {modalLoading ? '⏳ ĐANG XÁC MINH TÀI KHOẢN...' : modalActionBtnText}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
