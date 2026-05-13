import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "token123.xyz - AI Token 中转站导航",
  description: "聚合主流AI中转站，帮助开发者一眼识别关键信息，快速跳转合适的服务。精选高性价比、稳定可靠的 GPT/Claude/Gemini API 代理服务。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        {children}
        {/* 固定页脚：免责声明 */}
        <footer className="mt-auto bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            免责声明：本站收录的中转站均为第三方服务，本站不对其质量和安全性负责，请开发者自行甄别风险。
          </div>
        </footer>
      </body>
    </html>
  );
}

