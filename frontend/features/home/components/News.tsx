import Image from 'next/image'
import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import type { Event } from '@/features/event/services/eventService'
import { Fade } from 'react-awesome-reveal'

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
    <div className='flex gap-4 mt-12'>
      <Fade direction="up" duration={800} triggerOnce>
        <div className="flex flex-col items-start justify-between w-1/2 pb-10">
          <div className="space-y-4">
            <h1 className='text-xl text-foreground font-bold leading-tight'>{title}</h1>
            <p className='text-[17px] text-[#808285] w-1/2 leading-relaxed'>
              {shortDescription}
            </p>
            {eventLogoImage && (
              <div className="pt-2">
                <Image 
                  src={eventLogoImage} 
                  alt='news' 
                  width={180} 
                  height={100}
                  className="object-contain"
                />
              </div>
            )}
          </div>
          <Link 
            href={detailsButtonAction} 
            className='flex items-center gap-2 hover:gap-3 transition-all duration-300 group mt-4'
          >
            <MoveUpRight 
              size={16} 
              className='text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300' 
            />
            <p className='text-sm font-bold underline'>{detailsButtonText}</p>
          </Link>
        </div>
      </Fade>
      
      <Fade direction="up" duration={800} delay={200} triggerOnce>
        <div className="flex-1">
          <div className="flex gap-6 pb-8 w-[800px] overflow-auto scrollbar-hide">
            {displayImages.map((image, index) => (
              <div 
                key={index}
                className="min-w-[586px] max-w-[586px] min-h-[395px] max-h-[395px] relative overflow-hidden rounded-sm"
              >
                <Image 
                  src={image} 
                  alt={`news-${index + 1}`} 
                  width={586} 
                  height={395}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                />
              </div>
            ))}
          </div>
        </div>
      </Fade>
    </div>
  )
}
