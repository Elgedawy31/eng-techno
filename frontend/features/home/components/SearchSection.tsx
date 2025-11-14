import Image from 'next/image'

export default function SearchSection() {
  return (
    <div 
    className="h-[60vh] bg-cover p-16 flex flex-col justify-between"
    style={{ backgroundImage: `url(/search-bg.png)` }}
    >
      <div className="flex justify-between">
        <div className="w-1/3 text-white">
          <h1 className='text-6xl mb-2'>SEARCH THE TECHNO NETWORK</h1>
          <p className='text-2xl'>A global defense and security group shaping tomorrow across land, air, and sea.</p>
        </div>
        <div className="">
          <Image src='/search-logo.png' alt='logo' width={140} height={141} />
        </div>
      </div>
      <div className="border-b border-[#58595B] flex items-center justify-between pb-2">
        <p className="text-xl text-[#58595B]">What are you looking for? Vehicles, UAVs, Maritime Systems, Support…</p>
        <span className='border-b border-white text-white text-3xl'>SEARCH</span>
      </div>
    </div>
  )
}
