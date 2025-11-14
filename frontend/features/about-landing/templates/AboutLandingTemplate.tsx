"use client";

import Navbar from '@/features/home/components/Navbar'
import Global from '../components/Global'
import OurSection from '../components/OurSection'
import CoreValues from '../components/CoreValues'
import Compliance from '../components/Compliance'
import { useAboutPageHero } from '@/features/aboutPageHero/hooks/useAboutPageHero'
import { Fade } from 'react-awesome-reveal'
import OurClients from '../components/OurClients';

function AboutLandingTemplate() {
  const { aboutPageHero } = useAboutPageHero()
  
  // Use hero data with fallbacks
  const backgroundImage = aboutPageHero?.backgroundImage || "/about-hero-bg.png"
  const title = aboutPageHero?.title || "ABOUT US"

  return (
    <div>
      <div 
        className="h-[80vh] bg-cover  bg-no-repeat "
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full h-full bg-black/20 flex flex-col justify-between pb-12">
          <Navbar />
          <Fade direction="up" duration={800} delay={200} triggerOnce>
            <p className='text-brand text-2xl flex items-center ml-30 gap-1'>
              <span className="text-lg">{"//"}</span>
              {title}
            </p>
          </Fade>
        </div>
      </div>
      <Global />
      <OurSection />
      <OurClients />
      <CoreValues />
      <Compliance />
    </div>
  )
}

export default AboutLandingTemplate
