import { ChevronRight } from "lucide-react";

interface ImageAndTextProps {
  title: string;
  text1: string;
  text2: string;
  bgUrl: string;
}

export default function ImageAndText({title, text1, text2, bgUrl}: ImageAndTextProps) {
  return (
    <div 
    className="h-full bg-cover w-full "
    style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="flex flex-col h-full bg-black/20 justify-between px-14 py-12 ">
        <div className=" w-full space-y-6">
          <div className="border-b border-white pb-1 flex justify-between">
          <h1 className="text-white text-5xl font-bold font-heading leading-[100%]">{title}</h1>
          <ChevronRight strokeWidth={.5} size={40} className="text-white"/>
          </div>
          <div className="text-[22px] text-white">
            <p>{text1}</p>
            <p>{text2}</p>
          </div>
          <div className="border p-1 w-fit border-white">
            <span className="text-white border-r border-white p-1">AIR</span>
            <span className="text-white border-r border-white p-1">LAND</span>
            <span className="text-white p-1">SEA</span>
          </div>
        </div>

        <button className='py-2 text-[28px] flex items-center gap-4 text-white'>
          EXPLORE  
          <ChevronRight strokeWidth={1} size={35}/>
        </button>

      </div>
    </div>
  )
}
