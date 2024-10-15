"use client"
import { Menu, X, ZapIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              
              <span className="ml-2 text-3xl font-bold">𝐍𝐄𝐗𝐗</span>

            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Button variant="ghost" >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-gray-300" >
                <Link href="/sign-up">Get Started</Link>
                <ZapIcon className="size-3.5 ml-1.5 text-fuchsia-900 "  />
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 gap-2 space-y-1 sm:px-3">
          <Button variant="ghost" className="hover:bg-black hover:text-white">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-gray-300" >
                <Link href="/sign-up">Get Started</Link>
                <ZapIcon className="size-3.5 ml-1.5 text-fuchsia-900 "  />
              </Button>
          </div>
        </div>
      )}
    </nav>
  )
}