"use client"
import { useState } from 'react'
import { Menu, X, ZapIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const  LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
            <svg id="logo-72" width="40" height="40" viewBox="0 0 53 44" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M23.2997 0L52.0461 28.6301V44H38.6311V34.1553L17.7522 13.3607L13.415 13.3607L13.415 44H0L0 0L23.2997 0ZM38.6311 15.2694V0L52.0461 0V15.2694L38.6311 15.2694Z"  fill="#ffff"></path> </svg>
              <span className="ml-2 text-3xl font-bold text-white">exx</span>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <Button variant="ghost" className="text-white hover:text-gray-900 ">Sign In</Button>
            <Button className="ml-4 bg-white text-black group-hover:bg-orange-500 hover:text-white">Get Started                                    <ZapIcon className="size-3.5 ml-1.5 text-orange-500 fill-orange-500 hover:text-white" />
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">Sign In</Button>
            <Button className="w-full justify-start">
                Get Started
                <ZapIcon className="size-3.5 ml-1.5 text-orange-500 fill-orange-500" />

            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}