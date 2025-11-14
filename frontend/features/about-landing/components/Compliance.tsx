"use client";

import Image from 'next/image'
import Link from 'next/link'
import { Fade } from 'react-awesome-reveal'
import { useComplianceQuality } from '@/features/complianceQuality/hooks/useComplianceQuality'
import { ChevronRight } from 'lucide-react'

export default function Compliance() {
  const { complianceQuality } = useComplianceQuality();
  
  const title = complianceQuality?.title || "COMPLIANCE & QUALITY ASSURANCE";
  const firstDescription = complianceQuality?.firstDescription || 
    "We operate with unwavering transparency and accountability. Amstone International Group strictly adheres to international arms regulations including ITAR, EAR, and UN export control laws.";
  const logoImage = complianceQuality?.logoImage || "/search-logo.png";
  const displayImage = complianceQuality?.displayImage || "/compliance.png";
  const secondDescription = complianceQuality?.secondDescription || 
    "Our products and services meet global military standards such as MIL-STD, STANAG, and GOST, ensuring safety, reliability, and operational excellence. Every solution undergoes rigorous quality assurance processes, guaranteeing that our partners receive only";
  const buttonText = complianceQuality?.buttonText || "DOWNLOAD COMPANY PROFILE";
  const buttonAction = complianceQuality?.buttonAction || complianceQuality?.companyProfileFile || "#";

  return (
    <div className="w-full h-full bg-black flex flex-col gap-14 text-white py-25 px-20">
      <Fade direction="up" duration={800} triggerOnce>
        <div className="flex justify-between pb-14 border-b border-[#808285]">
          <div className="w-3/7">
            <h1 className='text-7xl mb-6'>{title}</h1>
            <p className='text-3xl'>
              {firstDescription}
            </p>
          </div>
          <div className="">
            <Image src={logoImage} alt='logo' width={140} height={141} className="object-contain" />
          </div>
        </div>
      </Fade>
      <Fade direction="up" duration={800} delay={200} triggerOnce>
        <div className="flex gap-14">
          <Image src={displayImage} alt='global' width={864} height={486} className="object-cover"/>
          <div className="flex flex-col justify-between w-1/2">
            <p className='text-3xl'>
              {secondDescription}
            </p>
            <Link 
              href={buttonAction}
              className='border w-fit border-white text-white py-2 px-3 text-sm flex items-center gap-2 mt-6 hover:bg-white/10 hover:gap-3 transition-all duration-300 group'
              {...(complianceQuality?.companyProfileFile ? { download: true, target: "_blank" } : {})}
            >
              {buttonText}
              <ChevronRight 
                size={20} 
                className='group-hover:translate-x-1 transition-transform duration-300'
              />
            </Link> 
          </div>
        </div>
      </Fade>
    </div>
  )
}
