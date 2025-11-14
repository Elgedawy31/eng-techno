import HomeTemplate from '@/features/home/templates/HomeTemplate'
import { fetchHero } from "@/features/hero/services/heroServerService";
import { fetchAbout } from "@/features/about/services/aboutServerService";
import { fetchServices } from "@/features/service/services/serviceServerService";

export default async function Home() {
  // Fetch hero, about, and services data on the server
  const [hero, about, services] = await Promise.all([
    fetchHero(),
    fetchAbout(),
    fetchServices(),
  ]);

  return <HomeTemplate hero={hero ?? null} about={about ?? null} services={services ?? []} />;
}
