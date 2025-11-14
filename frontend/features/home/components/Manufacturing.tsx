import { ChevronRight } from 'lucide-react'
import Link from "next/link";
import type { Service } from "@/features/service/services/serviceService";
import { formatTextWithNewlines } from "@/utils/text.utils";

interface ManufacturingProps {
  service?: Service;
}

export default function Manufacturing({ service }: ManufacturingProps) {
  const title = service?.title || "MANUFACTURING";
  const backgroundImage = service?.backgroundImage || "/manufacturing-bg.png";
  const categoryTags = service?.categoryTags || ["AIR", "LAND", "SEA"];
  const buttonText = service?.buttonText || "EXPLORE";
  const buttonAction = service?.buttonAction || "#";
  const additionalText = service?.additionalText || 
    "Techno Logistics ensures that every mission moves without hesitation. Through seamless coordination, global reach, and military-grade efficiency, we deliver equipment, maintenance, and support — wherever the mission demands. From the factory floor to the frontline, we make readiness a constant.";

  // Process description to split by "-"
  const description = service?.description || "";
  const formattedDescription = description ? formatTextWithNewlines(description) : "";
  const descriptionLines = formattedDescription.split("\n").filter((line) => line.trim().length > 0);
  
  // Fallback description
  const displayText1 = descriptionLines[0] || "BUILT FROM PRECISION.";
  const displayText2 = descriptionLines[1] || "FORGED FOR PERFORMANCE.";

  return (
    <div 
    className=" h-full bg-cover w-full"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col h-full bg-black/20 justify-between px-14 py-12 ">
          <div className="border-b border-white pb-1 flex justify-between">
          <h1 className="text-white text-5xl font-bold leading-[100%] font-heading">{title}</h1>
          <ChevronRight strokeWidth={.5} size={40} className="text-white"/>
          </div>
          <div className="space-y-6">
          <div className="border p-1 w-fit border-white">
            {categoryTags.map((tag, index) => (
              <span 
                key={index}
                className={`text-white ${index < categoryTags.length - 1 ? 'border-r border-white' : ''} p-1`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-4xl text-white">
            <p>{displayText1}</p>
            <p>{displayText2}</p>
          </div>
          {additionalText && (
            <div className="w-2/3">
              <p className="text-xl text-white">
                {additionalText}
              </p>
            </div>
          )}
        <Link href={buttonAction} className='py-2 mt-4 text-[28px] flex items-center gap-4 text-white'>
          {buttonText}
          <ChevronRight strokeWidth={1} size={35}/>
        </Link>
        </div>
      </div>
    </div>
  )
}
