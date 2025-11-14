import About from "../components/About";
import GroupSection from "../components/GroupSection";
import HeroSection from "../components/HeroSection";
import Industry from "../components/Industry";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import type { Hero } from "@/features/hero/services/heroService";
import { formatTextWithNewlines } from "@/utils/text.utils";

interface HomeTemplateProps {
  hero: Hero | null;
}

function HomeTemplate({ hero }: HomeTemplateProps) {
  const backgroundImage = hero?.backgroundImage || "/hero-bg.png";
  
  const processedHero = hero
    ? {
        ...hero,
        headline: formatTextWithNewlines(hero.headline),
        subtitle: formatTextWithNewlines(hero.subtitle),
      }
    : null;

  return (
    <main className="flex flex-col">
     <div 
      className="h-screen bg-cover bg-brand"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full h-full bg-black/20">
          <Navbar />
          <HeroSection hero={processedHero} isLoading={false} />
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
