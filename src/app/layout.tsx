import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenClaw Portal",
  description: "集中閱讀 OpenClaw 各任務產物（Portal）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="appHeader">
          <div className="appHeaderInner">
            <div className="brand">
              <div className="brandMark" aria-hidden="true" />
              <div className="brandText">
                <div className="brandTitle">OpenClaw Portal</div>
                <div className="brandSubtitle">黑底白字｜任務產物集中閱讀</div>
              </div>
            </div>
            <div className="headerActions">
              <div className="chip">/tasks/&lt;task&gt;/&lt;date&gt;</div>
            </div>
          </div>
        </header>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
