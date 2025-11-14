import { ChevronRight } from 'lucide-react'

export default function HeroSection() {
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
      <button className='bg-black py-2 px-3 text-sm flex items-center gap-2 mt-6 cursor-pointer'>
        EXPLORE  
        <ChevronRight size={20} className='text-white'/>
        </button>
    </div>
  )
}
