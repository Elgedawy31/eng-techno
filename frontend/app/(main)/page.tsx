import HomeTemplate from '@/features/home/templates/HomeTemplate'
import { fetchHero } from "@/features/hero/services/heroServerService";
import { fetchAbout } from "@/features/about/services/aboutServerService";

export default async function Home() {
  // Fetch hero and about data on the server
  const [hero, about] = await Promise.all([
    fetchHero(),
    fetchAbout(),
  ]);

  return <HomeTemplate hero={hero ?? null} about={about ?? null} />;
}
