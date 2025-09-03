import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { GameProvider } from "@/contexts/game-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Raspa Premios",
  description: "",
  generator: "Raspa Premios",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <GameProvider>{children}</GameProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
        <script 
        src="https://cdn.xtracky.com/scripts/interceptor.js"
        data-token="075774c6-bd2c-45b2-9d91-11ad6faf7766"
        data-click-id-param="click_id">
</script>
      </body>
    </html>
  )
}
