"use client";

import About from "../components/About";
import GroupSection from "../components/GroupSection";
import HeroSection from "../components/HeroSection";
import Industry from "../components/Industry";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import { useHero } from "@/features/hero/hooks/useHero";

function HomeTemplate() {
  const { hero, isLoading } = useHero();
  const backgroundImage = hero?.backgroundImage || "/hero-bg.png";

  return (
    <main className="flex flex-col">
     <div 
      className="h-screen bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full h-full bg-black/20">
          <Navbar />
          <HeroSection hero={hero} isLoading={isLoading} />
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
