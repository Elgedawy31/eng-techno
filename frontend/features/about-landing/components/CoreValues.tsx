import CoreCard from './CoreCard'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export default function CoreValues() {
  return (
    <div className="bg-[#F1F2F2]">

    <div className=' py-25 px-20'>
      <div className="w-2/3 mb-16">
        <h1 className='text-3xl text-[#C3996C] flex items-center mb-3'><span className='text-2xl'>{"//"}</span>CORE VALUES</h1>
        <p className='text-4xl font-medium'>
          At Amstone International Group, our work is guided by a set of
          non-negotiable values that define who we are and how we serve.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-25">
        <CoreCard 
          title='INTEGRITY'
          text='We uphold the highest ethical standards and ensure full compliance with international regulations.'
          />
          <CoreCard 
          title='INNOVATION'
          text='We harness cutting-edge technologies to deliver superior defense capabilities.'
          />
          <CoreCard 
          title='COMMITMENT'
          text='We are dedicated to meeting the evolving needs of our partners with professionalism and precision.'
          />
          <CoreCard 
          title='EXCELLENCE'
          text='We strive for unmatched quality in every product, service, and collaboration.'
          />
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
