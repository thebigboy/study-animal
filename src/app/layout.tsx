import type { Metadata } from "next";
import { GameProvider } from "@/components/game-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "学习认领小动物",
  description: "学习赚积分，喂养并升级你的学习伙伴。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <GameProvider>
          <SiteShell>{children}</SiteShell>
        </GameProvider>
      </body>
    </html>
  );
}
