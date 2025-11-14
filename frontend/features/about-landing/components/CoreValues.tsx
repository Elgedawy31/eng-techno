"use client";

import CoreCard from './CoreCard'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import CoreValuesHeader from './CoreValuesHeader'
import { useCoreValues } from '@/features/coreValue/hooks/useCoreValues'
import { Fade } from 'react-awesome-reveal'

export default function CoreValues() {
  const { coreValues } = useCoreValues();
  
  // Filter active core values and sort by order
  const activeCoreValues = coreValues
    .filter(cv => cv.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="bg-[#F1F2F2]">

    <div className=' py-25 px-20'>
      <CoreValuesHeader />
      <div className="grid grid-cols-4 gap-25">
        {activeCoreValues.map((coreValue, index) => (
          <Fade key={coreValue._id} direction="up" duration={800} delay={index * 100} triggerOnce>
            <CoreCard 
              title={coreValue.title}
              text={coreValue.description}
            />
          </Fade>
        ))}
      </div>
      </div>
        <div className="flex h-[750px]">
          <div className="bg-black text-center w-1/5">
            <h1 className='my-14 text-3xl text-primary'>GLOBAL PRESENCE</h1>
            <div className="w-full h-[603px] relative">
            <Image src='/presence.png' alt='pres' fill/>
            </div>
          </div>
          <div className=" mt-auto">
            < ArrowUpRight
            strokeWidth={1} size={250}/>
          </div>
          <div className="flex-1 h-full relative">
            <Image src='/presence2.png' alt='pres2' fill/>
          </div>
        </div>
    </div>
  )
}
