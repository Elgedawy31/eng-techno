"use client";

import Image from 'next/image'
import { useState } from 'react'

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    // Handle search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <div 
    className="h-[60vh] bg-cover p-16 flex flex-col justify-between"
    style={{ backgroundImage: `url(/search-bg.png)` }}
    >
      <div className="flex justify-between">
        <div className="w-1/3 text-white">
          <h1 className='text-6xl mb-2'>SEARCH THE TECHNO NETWORK</h1>
          <p className='text-2xl'>A global defense and security group shaping tomorrow across land, air, and sea.</p>
        </div>
        <div className="">
          <Image src='/search-logo.png' alt='logo' width={140} height={141} />
        </div>
      </div>
      <div className="border-b border-[#58595B] flex items-center justify-between pb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you looking for? Vehicles, UAVs, Maritime Systems, Support…"
          className="text-xl text-white bg-transparent border-none outline-none flex-1 placeholder:text-[#58595B]"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <button 
          onClick={handleSearch}
          className='border-b border-white text-white text-3xl cursor-pointer hover:opacity-80 transition-opacity'
        >
          SEARCH
        </button>
      </div>
    </div>
  )
}
