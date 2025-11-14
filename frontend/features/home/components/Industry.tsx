import News from './News'
import IndustryEvents from './IndustryEvents'
import IndustryAnnouncement from './IndustryAnnouncement'

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
      <IndustryAnnouncement />
      </div>
    </div>
  )
}
