import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const font = Be_Vietnam_Pro({
  variable: '--font-main',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'NEW 88 - Nơi Cảm Xúc Không Giới Hạn | Nạp Rút Nhanh Chóng 24/7',
  description: 'Trải nghiệm mượt mà, nạp rút nhanh chóng 24/7. Nhận ngay các ưu đãi khủng: Nạp đầu tặng 8,888K, Thứ 2 Ngày Vàng nạp tặng 5%, Lì xì nghìn tỷ ngày 6-16-26, Hợp tác đại lý 60%.',
  openGraph: {
    title: 'NEW 88 - Nơi Cảm Xúc Không Giới Hạn',
    description: 'Nạp rút nhanh chóng 24/7. Nhận lì xì nghìn tỷ và nạp đầu tặng 8,888K!',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'NEW 88 Promotional Banner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEW 88 - Nơi Cảm Xúc Không Giới Hạn',
    description: 'Ưu đãi cực khủng 24/7!',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={font.variable}>{children}</body>
    </html>
  );
}
