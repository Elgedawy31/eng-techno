"use client";

import { useMediaCentre } from "@/features/mediaCentre/hooks/useMediaCentre";
import { Fade } from "react-awesome-reveal";


export default function IndustryEvents() {
  const { mediaCentre : mediaCentreData } = useMediaCentre()
  
  const mediaCentre = mediaCentreData || null
  const mainTitle = mediaCentre?.mainTitle || "INDUSTRY EVENTS"
  const mainDescription = mediaCentre?.mainDescription || 
    "At Techno International Group, we believe that leadership in defense and security extends beyond delivering equipment and expertise — it's about being at the heart of global conversations that shape the future of defense. That's why we actively participate in the world's most influential defense exhibitions and summits, where we"

  return (
    <div className="h-[50vh] border-b border-[#808285] flex flex-col justify-center">
      <Fade direction="up" duration={800} triggerOnce>
        <div className="mb-5">
          <h3 className='text-brand text-sm flex items-center gap-1'>
            <span className="text-xs">{"//"}</span>
            DEFINING TECHNO
          </h3>
          <p className='text-[#090909] text-xl mt-1'>{mainTitle}</p>
        </div>
      </Fade>
      
      <Fade direction="up" duration={800} delay={200} triggerOnce>
        <p className='w-3/4 text-3xl font-medium leading-relaxed text-[#090909]'>
          {mainDescription}
        </p>
      </Fade>
    </div>
  )
}

