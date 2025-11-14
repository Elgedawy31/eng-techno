import { ChevronRight } from 'lucide-react'

export default function Manufacturing() {
  return (
    <div 
    className=" h-full bg-cover w-full"
    style={{ backgroundImage: `url(/manufacturing-bg.png)` }}
    >
      <div className="flex flex-col h-full bg-black/20 justify-between px-14 py-12 ">
          <div className="border-b border-white pb-1 flex justify-between">
          <h1 className="text-white text-5xl font-bold leading-[100%]">MANUFACTURING</h1>
          <ChevronRight strokeWidth={.5} size={40} className="text-white"/>
          </div>
          <div className="space-y-6">
          <div className="border p-1 w-fit border-white">
            <span className="text-white border-r border-white p-1">AIR</span>
            <span className="text-white border-r border-white p-1">LAND</span>
            <span className="text-white p-1">SEA</span>
          </div>
          <div className="text-4xl text-white">
            <p>BUILT FROM PRECISION.</p>
            <p>FORGED FOR PERFORMANCE.</p>
          </div>
          <div className="w-2/3">
            <p className="text-xl text-white">
            Techno Logistics ensures that every mission moves 
            without hesitation. Through seamless coordination, global 
            reach, and military-grade efficiency, we deliver equipment, 
            maintenance, and support — wherever the mission 
            demands. From the factory floor to the frontline, we make 
            readiness a constant.
            </p>
          </div>
        <button className='py-2 mt-4 text-[28px] flex items-center gap-4 text-white'>
          EXPLORE  
          <ChevronRight strokeWidth={1} size={35}/>
        </button>
        </div>
      </div>
    </div>
  )
}
