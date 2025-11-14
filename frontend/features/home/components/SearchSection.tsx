"use client";

import Image from 'next/image'
import { useState } from 'react'
import { useSearch } from '@/features/search/hooks/useSearch'
import { formatTextWithNewlines } from '@/utils/text.utils'

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const { search, isLoading } = useSearch()

  const handleSearch = () => {
    // Handle search functionality here
    console.log('Searching for:', searchQuery)
  }

  // Use search data with fallbacks
  const title = search?.title || "SEARCH THE TECHNO NETWORK"
  const subtitle = search?.subtitle || "A global defense and security group shaping tomorrow across land, air, and sea."
  const placeholder = search?.placeholder || "What are you looking for? Vehicles, UAVs, Maritime Systems, Support…"
  const buttonText = search?.buttonText || "SEARCH"
  const logoImage = search?.logoImage || "/search-logo.png"

  // Format subtitle to handle "-" separator
  const formattedSubtitle = formatTextWithNewlines(subtitle)
  const subtitleLines = formattedSubtitle.split("\n").filter((line) => line.trim().length > 0)

  return (
    <div 
    className="h-[60vh] bg-cover p-16 flex flex-col justify-between"
    style={{ backgroundImage: `url(/search-bg.png)` }}
    >
      <div className="flex justify-between">
        <div className="w-1/3 text-white">
          <h1 className='text-6xl mb-2'>{title}</h1>
          <p className='text-2xl'>
            {subtitleLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < subtitleLines.length - 1 && " "}
              </span>
            ))}
          </p>
        </div>
        <div className="">
          <Image src={logoImage} alt='logo' width={140} height={141} />
        </div>
      </div>
      <div className="border-b border-[#58595B] flex items-center justify-between pb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="text-xl text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#58595B]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          disabled={isLoading}
        />
        <button 
          onClick={handleSearch}
          className='border-b border-white text-white text-3xl cursor-pointer hover:opacity-80 transition-opacity'
          disabled={isLoading}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}
