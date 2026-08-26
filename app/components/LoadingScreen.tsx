'use client';

import React from 'react';

interface LoadingScreenProps {
  progress: number;
  statusText: string;
  isFadingOut?: boolean;
  errorOccurred?: boolean;
  onRetry?: () => void;
}

export default function LoadingScreen({
  progress,
  statusText,
  isFadingOut = false,
  errorOccurred = false,
  onRetry,
}: LoadingScreenProps) {
  const cappedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`loading-screen-overlay ${isFadingOut ? 'fade-out' : ''}`}
      aria-label="Loading Page"
      role="status"
    >
      <div className="loading-card">
        {/* Brand Header */}
        <div className="loading-brand-box">
          <div className="loading-logo-wrapper">
            <span className="loading-logo-main">NEW</span>
            <span className="loading-logo-badge">88</span>
          </div>
          <p className="loading-brand-sub">NƠI CẢM XÚC KHÔNG GIỚI HẠN</p>
        </div>

        {/* Circular Loader Spinner */}
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner-ring"></div>
          <div className="loading-spinner-glow"></div>
          <div className="loading-percent-display">{cappedProgress}%</div>
        </div>

        {/* Linear Progress Bar */}
        <div className="loading-progress-container">
          <div
            className="loading-progress-fill"
            style={{ width: `${cappedProgress}%` }}
          />
        </div>

        {/* Status Text & Message */}
        <div className="loading-status-box">
          <p className="loading-status-text">
            {errorOccurred ? '⚡ Tải tài nguyên hoàn tất (Chế độ an toàn)' : statusText}
          </p>
          <p className="loading-subtext">
            {isFadingOut
              ? 'Đang mở Landing Page...'
              : 'Đang tự động chuẩn bị tài nguyên và ưu đãi dành cho bạn...'}
          </p>
        </div>

        {/* Fallback Action Button if Error Occurs */}
        {errorOccurred && onRetry && (
          <button className="loading-retry-btn" onClick={onRetry}>
            TRUY CẬP NGAY LANDING PAGE →
          </button>
        )}
      </div>
    </div>
  );
}
