import Image from 'next/image'
import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import type { Event } from '@/features/event/services/eventService'

interface NewsProps {
  event?: Event;
}

export default function News({ event }: NewsProps) {
  // Use event data with fallbacks
  const title = event?.title || "International Airshows & Defense Summits – 2024"
  const shortDescription = event?.shortDescription || 
    "Actively present at global airshows, Techno showcases advanced aircraft, UAV, and drone solutions while forging strategic international partnerships."
  const eventLogoImage = event?.eventLogoImage || "/egypt-news.png"
  const detailsButtonText = event?.detailsButtonText || "VIEW FULL EVENT DETAILS"
  const detailsButtonAction = event?.detailsButtonAction || "/"
  const displayImages = event?.displayImages || ["/news-1.png", "/news-2.png"]

  return (
    <div className='flex gap-4 mt-12  '>
      <div className="flex flex-col items-start justify-between w-1/2 pb-10">
        <div className="space-y-2">
          <h1 className='text-xl text-foreground font-bold'>{title}</h1>
          <p className='text-[17px] text-[#808285] w-1/2'>
            {shortDescription}
          </p>
          {eventLogoImage && (
            <Image src={eventLogoImage} alt='news' width={180} height={100} />
          )}
        </div>
        <Link href={detailsButtonAction} className='flex items-center gap-1 hover:opacity-80 transition-opacity'>
          <MoveUpRight size={16} className='text-brand' />
          <p className='text-sm font-bold underline'>{detailsButtonText}</p>
        </Link>
      </div>
      <div className="flex-1   ">
      <div className="flex gap-6 pb-8 w-[800px]  overflow-auto">
        {displayImages.map((image, index) => (
          <Image 
            key={index}
            src={image} 
            alt={`news-${index + 1}`} 
            width={586} 
            height={395} 
            className='min-w-[586px] max-w-[586px] min-h-[395px] max-h-[395px]'
          />
        ))}
      </div>
      </div>
    </div>
  )
}
