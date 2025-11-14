import { ChevronRight } from "lucide-react";

export default function About() {
  return (
    <div className='bg-black h-[70vh] py-20 px-12'>
      <div className='w-full mx-auto border border-white'></div>
      <div className="ml-80 mr-40 mt-12 flex items-start gap-45">
        <div className=" w-full">
        <h1 className='text-brand text-xl flex items-center'> <span className="text-base">{"//"}</span>DEFINING TECHNO</h1>
        </div>
        <div className="">
          <p className="text-white text-4xl">
            Techno International Group is a premier provider of defense
            and security solutions, dedicated to enhancing national
            security and operational readiness across the globe. With
            decades of experience and a network of over 4,000 experts
            across Africa and beyond, we deliver comprehensive, mission-ready
            solutions tailored to armed forces, law enforcement
            agencies, and government institutions.
          </p>
          <div className="flex items-center mt-6 gap-3">
            <button className='border border-white text-white py-2 px-3 text-sm flex items-center gap-2 mt-6'>
              EXPLORE  
              <ChevronRight strokeWidth={.5} size={20}/>
            </button>       
            <button className='border border-white text-white py-2 px-3 text-sm flex items-center gap-2 mt-6'>
              DOWNLOAD COMPANY PROFILE
            </button>        
          </div>
        </div>
      </div>
    </div>
  )
}
