import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryClient";
import HomeTemplate from '@/features/home/templates/HomeTemplate'
import { fetchHero } from "@/features/hero/services/heroServerService";

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch hero data for SEO and optimization
  await queryClient.prefetchQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const serverData = await fetchHero();
      return serverData;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
    <HomeTemplate />
    </HydrationBoundary>
  );
}
