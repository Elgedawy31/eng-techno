"use client";

import { useMediaCentres } from '@/features/mediaCentre/hooks/useMediaCentres'

export default function IndustryEvents() {
  const { mediaCentres } = useMediaCentres()
  
  const mediaCentre = mediaCentres?.[0] || null
  const mainTitle = mediaCentre?.mainTitle || "INDUSTRY EVENTS"
  const mainDescription = mediaCentre?.mainDescription || 
    "At Techno International Group, we believe that leadership in defense and security extends beyond delivering equipment and expertise — it's about being at the heart of global conversations that shape the future of defense. That's why we actively participate in the world's most influential defense exhibitions and summits, where we"

  return (
    <div className="h-[50vh] border-b border-[#808285]">
      <div className="mb-5">
        <h3 className='text-brand text-sm flex items-center'> <span className="text-xs">{"//"}</span>DEFINING TECHNO</h3>
        <p className='text-[#090909] text-xl'>{mainTitle}</p>
      </div>
      <p className='w-3/4 text-3xl font-medium'>
        {mainDescription}
      </p>
    </div>
  )
}

