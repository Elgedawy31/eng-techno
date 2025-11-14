import Image, { StaticImageData } from "next/image";
import Logo from "@/assets/search-logo.png";

interface OurImageAndTextProps {
  title: string;
  img: StaticImageData;
  text: string;
}

export default function OurImageAndText({title, img, text}: OurImageAndTextProps) {
  return (
    <div className='flex h-[960px] even:flex-row-reverse'>
    <div className="w-1/2 h-full flex flex-col justify-between p-20">
      <div className="">
        <h1 className="text-[45px] mb-2">{title}</h1>
        <Image src={Logo} alt="Logo" width={68} height={68}/>
      </div>
      <p className="text-3xl font-medium">{text}</p>
    </div>
    <div className="w-1/2 h-full relative">
      <Image src={img} alt="image" fill/>
    </div>
    </div>
  )
}
