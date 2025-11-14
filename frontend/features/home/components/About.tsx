import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { About as AboutType } from "@/features/about/services/aboutService";
import { formatTextWithNewlines } from "@/utils/text.utils";
import { Fade } from "react-awesome-reveal";

interface AboutProps {
  about: AboutType | null;
}

export default function About({ about }: AboutProps) {
  const label = about?.label || "DEFINING TECHNO";
  const description = about?.description || 
    "Techno International Group is a premier provider of defense and security solutions, dedicated to enhancing national security and operational readiness across the globe. With decades of experience and a network of over 4,000 experts across Africa and beyond, we deliver comprehensive, mission-ready solutions tailored to armed forces, law enforcement agencies, and government institutions.";
  const button1Text = about?.button1Text || "EXPLORE";
  const button1Action = about?.button1Action || "#";
  const button2Text = about?.button2Text || "DOWNLOAD COMPANY PROFILE";
  const companyProfileFile = about?.companyProfileFile;

  const formattedDescription = formatTextWithNewlines(description);
  const descriptionLines = formattedDescription.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className='bg-black h-[70vh] py-20 px-12'>
      <div className='w-full mx-auto border border-white'></div>
      <div className="ml-80 mr-40 mt-12 flex items-start gap-45">
          <div className=" w-full">
          <Fade direction="up" duration={800} delay={200} triggerOnce>
            <h1 className='text-brand text-xl flex items-center'> {label}</h1>
          </Fade>
        </div>
        <div className="">
          <Fade direction="up" duration={800} delay={400} triggerOnce>
          <p className="text-white text-4xl">
            {descriptionLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < descriptionLines.length - 1 && " "}
              </span>
            ))}
          </p>
          </Fade>
          <div className="flex items-center mt-6 gap-3">
            {button1Text && (
              <Fade direction="up" duration={800} delay={600} triggerOnce> 
                <Link 
                  href={button1Action} 
                  className='border border-white text-white py-2 px-3 text-sm flex items-center gap-2 hover:bg-white/10 hover:gap-3 transition-all duration-300 group'
                >
                  {button1Text}
                  <ChevronRight 
                    strokeWidth={.5} 
                    size={20}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </Fade>
            )}
            {button2Text && (
              <Fade direction="up" duration={800} delay={800} triggerOnce>
                <Link 
                  href={companyProfileFile || "#"} 
                  className='border border-white text-white py-2 px-3 text-sm flex items-center gap-2 hover:bg-white/10 hover:gap-3 transition-all duration-300 group'
                  {...(companyProfileFile ? { download: true, target: "_blank" } : {})}
                >
                  {button2Text}
                </Link>
              </Fade>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
