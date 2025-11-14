import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fade } from 'react-awesome-reveal';

export default function Global() {
  return (
    <div 
    className="min-h-screen bg-cover"
    style={{ backgroundImage: `url(/global-bg.png)` }}
    >
      <div className="w-full h-full bg-white/20 flex flex-col gap-20  py-25 px-20">
        <div className="w-1/2">
          <h1 className='text-6xl'> GLOBAL LEADERS IN </h1>
          <h1 className='text-[55px] mb-4'>DEFENSE & SECURITY SOLUTIONS</h1>
          <p className='text-3xl'>
          Amstone International Group stands as a premier provider
          of defense and security solutions, committed to strengthening
            national security and advancing operational readiness worldwide.
            We deliver more than products — we deliver confidence, resilience, and i
          </p>
        </div>
        <div className="flex gap-20">
          <Image src='/global-image.png' alt='global' width={720} height={786}/>
          <div>
          <p className='text-3xl w-1/2'>
            With decades of experience and a robust presence across 30+ countries, 
            our operations are supported by a global network of over 4,000 defense and security 
            experts. From military equipment and advanced technologies to strategic consulting and training, we
            </p>
            <Fade direction="up" duration={800} delay={600} triggerOnce>
          <Link 
            href='/'
            className='bg-black w-fit text-white py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer hover:bg-black/80 hover:gap-3 transition-all duration-300 group'
          >
            DOWNLOAD COMPANY PROFILE
            <ChevronRight 
              size={20} 
              className='text-white group-hover:translate-x-1 transition-transform duration-300'
            />
          </Link>
        </Fade>
          </div>
        </div>
      </div>
    </div>
  )
}
