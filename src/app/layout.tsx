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
  title: "token123.xyz - AI Token 中转站权威榜单",
  description: "按价格、可靠性和透明度综合排序，帮助开发者基于可核实证据判断 AI Token 中转站的当前推荐价值。",
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
        <footer className="mt-auto bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            免责声明：榜单基于公开证据与当前核验口径整理，不构成购买建议；第三方服务质量、安全性和价格变化请自行复核。
          </div>
        </footer>
      </body>
    </html>
  );
}
