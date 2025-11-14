import About from "../components/About";
import GroupSection from "../components/GroupSection";
import HeroSection from "../components/HeroSection";
import Industry from "../components/Industry";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";


function HomeTemplate() {
  return (
    <main className="flex flex-col">
     <div 
      className="h-screen bg-cover"
      style={{ backgroundImage: `url(/hero-bg.png)` }}
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
    </main>
  );
}

export default HomeTemplate;
