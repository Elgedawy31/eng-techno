"use client";

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Hero } from '@/features/hero/services/heroService';

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
        <div>
          <h1 className='text-6xl font-normal font-heading leading-[100%]'>GLOBAL LEADERS IN</h1>
          <h1 className='text-6xl font-normal font-heading'>DEFENSE & SECURITY SOLUTIONS</h1>
        </div>
        <div>
          <p className='text-2xl'>Empowering nations with cutting-edge equipment,</p>
          <p className='text-2xl'>advanced technology, and trusted expertise.</p>
        </div>
        <button className='bg-black py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 transition-colors'>
          EXPLORE  
          <ChevronRight size={20} className='text-white'/>
        </button>
      </div>
    );
  }

  // Render hero content from API
  return (
    <div className='flex flex-col items-start justify-center h-[86.7vh] text-white gap-4 px-70'>
      <div>
        <h1 className='text-6xl font-normal font-heading leading-[100%]'>
          {hero.headline}
        </h1>
      </div>
      <div>
        <p className='text-2xl'>{hero.subtitle}</p>
      </div>
      {hero.buttonText && hero.buttonAction && (
        <Link 
          href={hero.buttonAction}
          className='bg-black py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 transition-colors'
        >
          {hero.buttonText}
          <ChevronRight size={20} className='text-white'/>
        </Link>
      )}
    </div>
  );
}
