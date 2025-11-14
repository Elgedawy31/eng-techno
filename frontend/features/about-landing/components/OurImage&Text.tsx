import Image from "next/image";
import { Fade } from "react-awesome-reveal";

interface OurImageAndTextProps {
  title: string;
  img: string;
  text: string;
  logoImage?: string;
}

export default function OurImageAndText({title, img, text, logoImage = "/search-logo.png"}: OurImageAndTextProps) {
  return (
    <div className='flex h-[960px] even:flex-row-reverse'>
      <Fade direction="up" duration={800} triggerOnce>
        <div className=" h-full flex flex-col justify-between p-20">
          <div className="">
            <h1 className="text-[45px] mb-2  font-heading">{title}</h1>
            <Image src={logoImage} alt="Logo" width={68} height={68}/>
          </div>
          <p className="text-3xl font-medium">{text}</p>
        </div>
      </Fade>
      <Fade direction="up" duration={800} delay={200} triggerOnce>
        <div className="w-1/2 h-full relative min-w-[50vw]">
          <Image src={img} alt="image" fill className="object-cover"/>
        </div>
      </Fade>
    </div>
  )
}
