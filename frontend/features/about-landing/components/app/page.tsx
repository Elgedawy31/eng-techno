import HeroBackground from "@/assets/hero-bg.png"
import About from "@/component/home/About";
import Footer from "@/component/home/Footer";
import GroupSection from "@/component/home/GroupSection";
import HeroSection from "@/component/home/HeroSection";
import Industry from "@/component/home/Industry";
import Navbar from "@/component/home/Navbar";
import SearchSection from "@/component/home/SearchSection";

export default function Home() {
  return (
    <div className="">
      <div 
      className="h-screen bg-cover"
      style={{ backgroundImage: `url(${HeroBackground.src})` }}
      >
        <div className="w-full h-full bg-black/20">
          <Navbar />
          <HeroSection />
        </div>
      </div>
      <About />
      <GroupSection />
      <SearchSection />
      <Industry />
      <Footer />
    </div>
  );
}
