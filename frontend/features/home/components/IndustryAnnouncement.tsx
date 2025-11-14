"use client";

import Image from 'next/image'
import { useAnnouncement } from '@/features/announcement/hooks/useAnnouncement'
import { formatTextWithNewlines } from '@/utils/text.utils'

export default function IndustryAnnouncement() {
  const { announcements } = useAnnouncement()
  
  const announcement = announcements?.[0] || null
  const title = announcement?.title || "LEADING THE FUTURE OF DEFENSE"
  const tagline = announcement?.tagline || "AT EDEX 2025."
  const description = announcement?.description || 
    "This year, Amstone proudly joins the region's most influential defense exhibition — EDEX 2025 — as a headline sponsor and strategic partner. Across a commanding presence of over 1,400 sqm, we unveil our latest advancements spanning land, air, and sea. From"
  const eventLogoImage = announcement?.eventLogoImage || "/defemce.png"
  const boothInfo = announcement?.boothInfo || "VISIT US AT - BOOTH 14 - HALL 3"

  // Format boothInfo to handle "-" separator
  const formattedBoothInfo = formatTextWithNewlines(boothInfo)
  const boothInfoLines = formattedBoothInfo.split("\n").filter((line) => line.trim().length > 0)

  return (
    <div className="mt-12">
      <div className="flex gap-4 items-center mb-12">
        <Image src={eventLogoImage} alt='def' width={182} height={182}/>
        <div className="">
          <h1 className='text-3xl mb-2'>{title}</h1>
          <h1 className='text-8xl leading-[100%]'>{tagline}</h1>
        </div>
      </div>
      <p className='text-4xl font-medium w-3/4 mb-8'>
        {description}
      </p>
      <p className='text-brand text-3xl w-66 font-bold underline'>
        {boothInfoLines.map((line, index) => (
          <span key={index}>
            {line}
            {index < boothInfoLines.length - 1 && " "}
          </span>
        ))}
      </p>
    </div>
  )
}

