import HeroBackground from '@/assets/about-hero-bg.png';
import Compliance from '@/component/about/Compliance';
import CoreValues from '@/component/about/CoreValues';
import Global from '@/component/about/Global';
import OurSection from '@/component/about/OurSection';
import Footer from '@/component/home/Footer';
import Navbar from '@/component/home/Navbar';

export default function AboutUs() {
  return (
    <div>
      <div 
        className="h-screen bg-cover"
        style={{ backgroundImage: `url(${HeroBackground.src})` }}
        >
          <div className="w-full h-full bg-black/20 flex flex-col justify-between pb-12">
            <Navbar />
            <p className='text-[#C3996C] text-2xl flex items-center ml-30'><span className="text-lg">{"//"}</span>ABOUT US</p>
          </div>
      </div>
      <Global />
      <OurSection />
      <CoreValues />
      <Compliance />
      <Footer />
    </div>
  )
}
