import HomeTemplate from '@/features/home/templates/HomeTemplate'
import { fetchHero } from "@/features/hero/services/heroServerService";

export default async function Home() {
  // Fetch hero data on the server
  const hero = await fetchHero();

  return <HomeTemplate hero={hero ?? null} />;
}
