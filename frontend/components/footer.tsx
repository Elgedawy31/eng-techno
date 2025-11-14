"use client";

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useFooter } from '@/features/footer/hooks/useFooter'
import { formatTextWithNewlines } from '@/utils/text.utils'

export default function Footer() {
  const { footer } = useFooter()

  // Use footer data with fallbacks
  const mainTitle = footer?.mainTitle || "Contact"
  const subtitle = footer?.subtitle || "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER."
  const email = footer?.email || "info@technoig.com"
  const phone = footer?.phone || "+207 29801663"
  const officeLocations = footer?.officeLocations || "Offices in Egypt, UAE, Hungary, South Africa, Central Africa"
  const buttonText = footer?.buttonText || "GET IN TOUCH"
  const buttonAction = footer?.buttonAction || "/"

  // Format subtitle to handle "-" separator
  const formattedSubtitle = formatTextWithNewlines(subtitle)
  const subtitleLines = formattedSubtitle.split("\n").filter((line) => line.trim().length > 0)

  return (
    <div 
    className="h-[804px] bg-cover px-16 py-25 bg-black"
    
    >
      <div 
      className="bg-contain bg-no-repeat bg-center h-full w-full flex items-center justify-center text-center"
      style={{ backgroundImage: `url(/footer-bg-2.png)` }}
      >
        <div className="flex flex-col h-full gap-40">
          <div className="space-y-4  w-[450px]">
            <h1 className='font-bold text-[28px] text-[#808285]'>{mainTitle}</h1>
            <h1 className='text-4xl text-white'>
              {subtitleLines.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < subtitleLines.length - 1 && " "}
                </span>
              ))}
            </h1>
          </div>
          <div className="text-white">
            <a 
              href={`mailto:${email}`}
              className='font-medium text-xl underline mb-6 block hover:opacity-80 transition-opacity'
            >
              {email}
            </a>
            <p className="font-medium text-xl underline">{officeLocations}</p>
            <p className="font-medium text-xl underline">{phone}</p>
            <Link 
              href={buttonAction}
              className='border border-white py-2 px-3 text-sm flex items-center gap-2 mt-12 mx-auto w-fit hover:bg-white/10 transition-colors'
            >
              {buttonText}
              <ChevronRight strokeWidth={.5} size={20}/>
            </Link>
          </div>
          </div>
        </div>
    </div>
  )
}
