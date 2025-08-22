import type { Metadata } from 'next'
import '../globals.css'
import { Toaster } from '@/components/ui/toaster'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'PT RJ - Acesso',
}

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-[#C62828]">
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  )
} 