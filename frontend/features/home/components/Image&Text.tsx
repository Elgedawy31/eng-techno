import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/features/service/services/serviceService";
import { formatTextWithNewlines } from "@/utils/text.utils";
import { Fade } from "react-awesome-reveal";
interface ImageAndTextProps {
  service?: Service;
  title?: string;
  text1?: string;
  text2?: string;
  bgUrl?: string;
}

export default function ImageAndText({ service, title, text1, text2, bgUrl }: ImageAndTextProps) {
  // Use service data if provided, otherwise use fallback props
  const displayTitle = service?.title || title || "";
  const displayBgUrl = service?.backgroundImage || bgUrl || "";
  const buttonText = service?.buttonText || "EXPLORE";
  const buttonAction = service?.buttonAction || "#";
  const categoryTags = service?.categoryTags || ["AIR", "LAND", "SEA"];

  // Process description to split by "-"
  const description = service?.description || "";
  const formattedDescription = description ? formatTextWithNewlines(description) : "";
  const descriptionLines = formattedDescription.split("\n").filter((line) => line.trim().length > 0);
  
  // Fallback to text1/text2 if no service description
  const displayText1 = descriptionLines[0] || text1 || "";
  const displayText2 = descriptionLines[1] || text2 || "";

  return (
    <div 
    className="h-full bg-cover w-full bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${displayBgUrl})` }}
    >
      <div className="flex flex-col h-full bg-black/20 justify-between px-14 py-12">
        <div className="w-full space-y-6">
          <Fade direction="up" duration={800} triggerOnce>
            <div className="border-b border-white pb-1 flex justify-between items-center">
              <h1 className="text-white text-5xl font-bold font-heading leading-[100%]">{displayTitle}</h1>
              <ChevronRight strokeWidth={.5} size={40} className="text-white"/>
            </div>
          </Fade>
          
          <Fade direction="up" duration={800} delay={200} triggerOnce>
            <div className="text-[22px] text-white space-y-2">
              {displayText1 && <p>{displayText1}</p>}
              {displayText2 && <p>{displayText2}</p>}
            </div>
          </Fade>
          
          <Fade direction="up" duration={800} delay={400} triggerOnce>
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
          </Fade>
        </div>

        <Fade direction="up" duration={800} delay={600} triggerOnce>
          <Link 
            href={buttonAction} 
            className='py-2 text-[28px] flex items-center gap-4 text-white hover:gap-6 transition-all duration-300 group'
          >
            {buttonText}
            <ChevronRight strokeWidth={1} size={35} className="group-hover:translate-x-1 transition-transform duration-300"/>
          </Link>
        </Fade>

      </div>
    </div>
  )
}
