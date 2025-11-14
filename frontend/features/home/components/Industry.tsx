"use client";

import News from './News'
import IndustryEvents from './IndustryEvents'
import IndustryAnnouncement from './IndustryAnnouncement'
import { useEvent } from '@/features/event/hooks/useEvent'

export default function Industry() {
  const { events } = useEvent()
  
  // Get events sorted by order, limit to 3
  const sortedEvents = events
    ?.filter(event => event.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3) || []

  return (
      <div className="border-x border-[#D1D3D4] pl-30 bg-[#F1F2F2]"
      >
      <div 
      className="min-h-screen bg-cover w-full py-30 pl-30 "
      style={{ backgroundImage: `url(/industry.png)` }}
      >
        <IndustryEvents />
        <div className="pb-40  space-y-20">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <News key={event._id} event={event} />
            ))
          ) : (
            // Fallback to 3 News components if no events
            <>
              <News />
              <News />
              <News />
            </>
          )}
        </div>
        <p className='border-b border-[#808285] w-14/15 mx-auto'></p>
        <IndustryAnnouncement />
        </div>
      </div>
  )
}
