"use client";

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Hero } from '@/features/hero/services/heroService';
import { Fade, Slide } from 'react-awesome-reveal';

interface HeroSectionProps {
  hero: Hero | null;
  isLoading: boolean;
}

export default function HeroSection({ hero, isLoading }: HeroSectionProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className='flex flex-col items-start justify-center h-[86.7vh] text-white gap-4 px-70'>
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-16 bg-white/20 rounded w-3/4"></div>
          <div className="h-16 bg-white/20 rounded w-2/3"></div>
          <div className="h-8 bg-white/20 rounded w-1/2 mt-4"></div>
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
          <div className="h-10 bg-white/20 rounded w-32 mt-6"></div>
        </div>
      </div>
    );
  }

  // Fallback content if no hero data
  if (!hero) {
    return (
      <div className='flex flex-col items-start justify-center h-[86.7vh] text-white gap-4 px-70'>
        <Fade direction="up" duration={800} delay={200} triggerOnce>
          <div>
            <Slide direction="up" duration={600} delay={0} triggerOnce>
              <h1 className='text-6xl font-normal font-heading leading-[100%]'>GLOBAL LEADERS IN</h1>
            </Slide>
            <Slide direction="up" duration={600} delay={100} triggerOnce>
              <h1 className='text-6xl font-normal font-heading'>DEFENSE & SECURITY SOLUTIONS</h1>
            </Slide>
          </div>
        </Fade>
        <Fade direction="up" duration={800} delay={400} triggerOnce>
          <div className="space-y-1">
            <p className='text-2xl leading-relaxed'>Empowering nations with cutting-edge equipment,</p>
            <p className='text-2xl leading-relaxed'>advanced technology, and trusted expertise.</p>
          </div>
        </Fade>
        <Fade direction="up" duration={800} delay={600} triggerOnce>
          <button className='bg-black py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 hover:gap-3 transition-all duration-300 group'>
            EXPLORE  
            <ChevronRight 
              size={20} 
              className='text-white group-hover:translate-x-1 transition-transform duration-300'
            />
          </button>
        </Fade>
      </div>
    );
  }

  const headlineLines = hero.headline.split("\n").filter((line) => line.trim().length > 0);
  const subtitleLines = hero.subtitle.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className='flex flex-col items-start justify-center h-[86.7vh] text-white gap-4 px-70'>
      <Fade direction="up" duration={800} delay={200} triggerOnce>
        <div>
          {headlineLines.map((line, index) => (
            <Slide key={index} direction="up" duration={600} delay={index * 100} triggerOnce>
              <h1 
                className={`text-6xl font-normal font-heading ${index === 0 ? 'leading-[100%]' : ''}`}
              >
                {line}
              </h1>
            </Slide>
          ))}
        </div>
      </Fade>
      <Fade direction="up" duration={800} delay={400} triggerOnce>
        <div className="space-y-1">
          {subtitleLines.map((line, index) => (
            <p key={index} className='text-2xl leading-relaxed'>
              {line}
            </p>
          ))}
        </div>
      </Fade>
      {hero.buttonText && hero.buttonAction && (
        <Fade direction="up" duration={800} delay={600} triggerOnce>
          <Link 
            href={hero.buttonAction}
            className='bg-black py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 hover:gap-3 transition-all duration-300 group'
          >
            {hero.buttonText}
            <ChevronRight 
              size={20} 
              className='text-white group-hover:translate-x-1 transition-transform duration-300'
            />
          </Link>
        </Fade>
      )}
    </div>
  );
}
