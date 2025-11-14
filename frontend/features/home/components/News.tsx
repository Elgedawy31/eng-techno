import Image from 'next/image'

import { MoveUpRight } from 'lucide-react'

export default function News() {
  return (
    <div className='flex gap-4 mt-12  '>
      <div className="flex flex-col items-start justify-between w-1/2 pb-10">
        <div className="space-y-2">
          <h1 className='text-xl text-foreground font-bold'>International Airshows & Defense Summits – 2024</h1>
          <p className='text-[17px] text-[#808285] w-1/2'>
            Actively present at global airshows, Techno 
            showcases advanced aircraft, UAV, and drone 
            solutions while forging strategic international 
            partnerships.
          </p>
          <Image src='/egypt-news.png' alt='news' width={180} height={100} />
        </div>
        <div className='flex items-center gap-1'>
        <MoveUpRight  size={16} className='text-brand' />
        <p className='text-sm font-bold underline'>VIEW FULL EVENT DETAILS</p>
        </div>
      </div>
      <div className="flex-1   ">
      <div className="flex gap-6 pb-8 w-[800px]  overflow-auto">
        <Image src='/news-1.png' alt='news' width={586} height={395} className='min-w-[586px] max-w-[586px] min-h-[395px] max-h-[395px]'/>
        <Image src='/news-2.png' alt='news' width={586} height={395} className='min-w-[586px] max-w-[586px] min-h-[395px] max-h-[395px]'/>
      </div>
      </div>
    </div>
  )
}
