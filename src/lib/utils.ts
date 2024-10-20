import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import localFont from 'next/font/local'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const gilroyBold = localFont({
  src: [
    {
      path: '../../public/font/gilroy_bold.ttf',
      weight: '700'
    }
  ],
})


export function generateInviteCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let code = ""
  for(let i = 0; i < length; i++) {
    code += characters[Math.floor(Math.random() * characters.length)]
  }
  return code
}