import Image from 'next/image'
import News from './News'
import IndustryEvents from './IndustryEvents'

export default function Industry() {
  return (
    <div className="border-x border-[#D1D3D4] px-30 bg-[#F1F2F2]"
    >
    <div 
    className="min-h-screen bg-cover w-full py-30 px-30"
    style={{ backgroundImage: `url(/industry.png)` }}
    >
      <IndustryEvents />
      <div className=" pb-40  space-y-20">
        <News />
        <News />
        <News />
      </div>
      <p className='border-b border-[#808285] w-14/15 mx-auto'></p>
      <div className="mt-12">
        <div className="flex gap-4 items-center mb-12">
          <Image src='/defemce.png' alt='def' width={182} height={182}/>
          <div className="">
            <h1 className='text-3xl mb-2'>LEADING THE FUTURE OF DEFENSE</h1>
            <h1 className='text-8xl leading-[100%]'>AT EDEX 2025.</h1>
          </div>
        </div>
          <p className='text-4xl font-medium w-3/4 mb-8'>
            This year, Amstone proudly joins the region’s
             most influential defense exhibition — EDEX 2025 — as 
             a headline sponsor and strategic partner. Across a commanding 
             presence of over 1,400 sqm, we unveil our latest advancements spanning 
             land, air, and sea. From
          </p>
          <p className='text-brand text-3xl w-66'>
          VISIT US AT 
          BOOTH 14 - HALL 3
          </p>
        </div>
      </div>
    </div>
  )
}
