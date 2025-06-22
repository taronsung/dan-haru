import type { Metadata } from "next";
import { Gaegu } from "next/font/google"; // Inter 대신 Gaegu import
import BottomNav from "@/components/common/buttom-nav";
import { Toaster } from "@/components/ui/sonner" // sonner import
import "./globals.css";

// 폰트 설정
const gaegu = Gaegu({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "단 하루",
  description: "나만의 작은 회고록",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
    <body className={gaegu.className}>
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
      <Toaster position="top-center" /> {/* 이 라인을 body 태그 안에 추가 */}
    </body>
    </html>
  );
}