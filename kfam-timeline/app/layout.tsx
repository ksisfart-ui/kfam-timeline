import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
  title: "暦家タイムライン", // サイトごとに書き換える
  description: "「暦家」の一日の行動を、タイムライン形式で見返せる非公式ファンサイト",
  // 公開するURLが決まったら指定
  metadataBase: new URL("https://kfam-timeline.vercel.app"), 
};

export const viewport: Viewport = {
  // ブラウザの上部バーの色（ダークモードに合わせて黒系にするなど）
  themeColor: "#1a1a1a", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        {/* 手動切り替えを有効にするため attribute="class" を指定 */}
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
