import Image from 'next/image';

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
          <p className='text-3xl w-1/2'>
            With decades of experience and a robust presence across 30+ countries, 
            our operations are supported by a global network of over 4,000 defense and security 
            experts. From military equipment and advanced technologies to strategic consulting and training, we
            </p>
        </div>
      </div>
    </div>
  )
}
