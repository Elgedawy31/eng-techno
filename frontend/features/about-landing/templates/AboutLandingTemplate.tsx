import Navbar from '@/features/home/components/Navbar'

function AboutLandingTemplate() {
  return (
    <div>
      <div 
        className="h-screen bg-cover"
        style={{ backgroundImage: `url(/about-hero-bg.png)` }}
        >
          <div className="w-full h-full bg-black/20 flex flex-col justify-between pb-12">
            <Navbar />
            <p className='text-[#C3996C] text-2xl flex items-center ml-30'><span className="text-lg">{"//"}</span>ABOUT US</p>
          </div>
      </div>
      {/* <Global />
      <OurSection />
      <CoreValues />
      <Compliance /> */}
    </div>
  )
}

export default AboutLandingTemplate
