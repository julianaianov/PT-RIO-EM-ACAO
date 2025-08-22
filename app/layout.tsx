import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'PT RJ - Plataforma Digital',
  description: 'Sistema de gestão digital para o Partido dos Trabalhadores do Rio de Janeiro',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-[#C62828]">
        {/* Global Navbar */}
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
