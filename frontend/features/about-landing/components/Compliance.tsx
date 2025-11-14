import Image from 'next/image'

export default function Compliance() {
  return (
    <div className="w-full h-full bg-black flex flex-col gap-14 text-white  py-25 px-20">
        <div className="flex justify-between pb-14 border-b border-[#808285]">
        <div className="w-3/7">
          <h1 className='text-7xl mb-6'> COMPLIANCE & QUALITY ASSURANCE</h1>
          <p className='text-3xl'>
            We operate with unwavering transparency and accountability.
             Amstone International Group strictly adheres to international 
             arms regulations including ITAR, EAR, and UN export control laws.
          </p>
        </div>
        <div className="">
          <Image src='/search-logo.png' alt='logo' width={140} height={141} />
        </div>
        </div>
        <div className="flex gap-14">
          <Image src='/compliance.png' alt='global' width={864} height={486}/>
          <div className="flex flex-col justify-between w-1/2">
            <p className='text-3xl '>
              Our products and services meet global military standards such as MIL-STD,
              STANAG, and GOST, ensuring safety, reliability, and operational excellence.
              Every solution undergoes rigorous quality assurance processes, guaranteeing
              that our partners receive only
            </p>
            <button className='border w-fit border-white text-white py-2 px-3 text-sm flex items-center gap-2 mt-6'>
              DOWNLOAD COMPANY PROFILE
            </button> 
          </div>
        </div>
      </div>
  )
}
