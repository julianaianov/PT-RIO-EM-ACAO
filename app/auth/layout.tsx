import type { Metadata } from 'next'
import '../globals.css'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'PT RJ - Acesso',
}

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-[#C62828]">
      <style>{`nav.sticky{display:none !important;}`}</style>
      {children}
      <Toaster />
    </div>
  )
} 