import { ChevronRight } from 'lucide-react'

export default function Footer() {
  return (
    <div 
    className="h-[804px] bg-cover px-16 py-25 bg-black"
    
    >
      <div 
      className="bg-contain bg-no-repeat bg-center h-full w-full flex items-center justify-center text-center"
      style={{ backgroundImage: `url(/footer-bg-2.png)` }}
      >
        <div className="flex flex-col h-full gap-40">
          <div className="space-y-4  w-[450px]">
            <h1 className='font-bold text-[28px] text-[#808285]'>Contact</h1>
            <h1 className='text-4xl text-white'>LET’S SHAPE THE FUTURE
            OF DEFENSE TOGETHER.</h1>
          </div>
          <div className="text-white">
            <p className='font-medium text-xl underline mb-6'>info@technoig.com</p>
            <p className="font-medium text-xl underline">Offices in Egypt, UAE, Hungary, South Africa, Central Africa</p>
            <p className="font-medium text-xl underline">+207 29801663</p>
            <button className='border border-white py-2 px-3 text-sm flex items-center gap-2 mt-12 mx-auto'>
              GET IN TOUCH
              <ChevronRight strokeWidth={.5} size={20}/>
            </button>
          </div>
          </div>
        </div>
    </div>
  )
}
