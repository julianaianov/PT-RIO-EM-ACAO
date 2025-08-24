import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-red-100">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-gray-900">PT RJ EM AÇÃO</div>
            <div className="text-xs text-gray-500">Poder Popular - Rio de Janeiro</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-widest text-gray-700">APOIO:</span>
          <img src="/logo.png" alt="Apoio" className="h-14 md:h-16 lg:h-20 object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <a href="https://pt.org.br" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-red-200 hover:ring-red-300 text-red-700" aria-label="Site oficial do PT">
            <Globe className="h-5 w-5" />
          </a>
          <a href="https://www.facebook.com/ptbrasil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-red-200 hover:ring-red-300 text-red-700" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/ptbrasil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-red-200 hover:ring-red-300 text-red-700" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="https://twitter.com/ptbrasil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-red-200 hover:ring-red-300 text-red-700" aria-label="Twitter/X">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://www.youtube.com/user/ptbrasil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full ring-1 ring-red-200 hover:ring-red-300 text-red-700" aria-label="YouTube">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}