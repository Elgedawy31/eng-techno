"use client";

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fade } from 'react-awesome-reveal';
import { useAboutPageContent } from '@/features/aboutPageContent/hooks/useAboutPageContent';
import { formatTextWithNewlines } from '@/utils/text.utils';

export default function Global() {
  const { aboutPageContent } = useAboutPageContent();
  
  // Use content data with fallbacks
  const backgroundImage = aboutPageContent?.backgroundImage || "/global-bg.png";
  const logoImage = aboutPageContent?.logoImage || "/global-image.png";
  const description = aboutPageContent?.description || 
    "Amstone International Group stands as a premier provider of defense and security solutions, committed to strengthening national security and advancing operational readiness worldwide. We deliver more than products — we deliver confidence, resilience, and i";
  const secondDescription = aboutPageContent?.secondDescription || 
    "With decades of experience and a robust presence across 30+ countries, our operations are supported by a global network of over 4,000 defense and security experts. From military equipment and advanced technologies to strategic consulting and training, we";
  const buttonText = aboutPageContent?.buttonText || "DOWNLOAD COMPANY PROFILE";
  const buttonAction = aboutPageContent?.buttonAction || aboutPageContent?.companyProfileFile || "/";
  
  // Process headline to split by newlines
  const headline = aboutPageContent?.headline || "GLOBAL LEADERS IN\nDEFENSE & SECURITY SOLUTIONS";
  const formattedHeadline = formatTextWithNewlines(headline);
  const headlineLines = formattedHeadline.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div 
    className="min-h-screen bg-cover"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full h-full bg-white/20 flex flex-col gap-20  py-25 px-20">
        <Fade direction="up" duration={800} triggerOnce>
          <div className="w-1/2">
            {headlineLines.map((line, index) => (
              <h1 key={index} className={index === 0 ? 'text-6xl font-heading' : 'text-[55px] mb-4 font-heading'}>
                {line}
              </h1>
            ))}
            <p className='text-3xl'>
              {description}
            </p>
          </div>
        </Fade>
        <div className="flex gap-20">
          <Fade direction="up" duration={800} delay={200} triggerOnce>
            <Image src={logoImage} alt='global' width={720} height={786} className='min-w-[720px] h-[786px] object-cover' />
          </Fade>
          <Fade direction="up" duration={800} delay={400} triggerOnce>
            <div>
              <p className='text-3xl w-1/2'>
                {secondDescription}
              </p>
              <Link 
                href={buttonAction}
                className='bg-black w-fit text-white py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 hover:gap-3 transition-all duration-300 group'
                {...(aboutPageContent?.companyProfileFile ? { download: true, target: "_blank" } : {})}
              >
                {buttonText}
                <ChevronRight 
                  size={20} 
                  className='text-white group-hover:translate-x-1 transition-transform duration-300'
                />
              </Link>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  )
}
