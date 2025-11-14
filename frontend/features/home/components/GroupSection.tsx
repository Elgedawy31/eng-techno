"use client";

import ImageAndText from './Image&Text'
import Manufacturing from './Manufacturing'
import type { Service } from "@/features/service/services/serviceService";
import { Fade } from "react-awesome-reveal";

interface GroupSectionProps {
  services: Service[];
}

export default function GroupSection({ services }: GroupSectionProps) {
  // Get services by order: 1 = SOLUTIONS, 2 = MANUFACTURING, 3 = LOGISTICS
  const solutionsService = services.find(s => s.order === 1);
  const manufacturingService = services.find(s => s.order === 2);
  const logisticsService = services.find(s => s.order === 3);

  return (
    <Fade duration={800} triggerOnce>
      <div className='flex h-screen'>
        <div className="flex-1">
          {solutionsService ? (
            <ImageAndText service={solutionsService} />
          ) : (
            <ImageAndText title="SOLUTIONS" text1="PROVEN POWER." text2='BATTLE-TESTED SOLUTIONS.' bgUrl={'/solutions-bg.png'} />
          )}
        </div>
        <div className="flex-2">
          <Manufacturing service={manufacturingService} />
        </div>
        <div className="flex-1">
          {logisticsService ? (
            <ImageAndText service={logisticsService} />
          ) : (
            <ImageAndText title="LOGISTICS" text1="ENGINEERED FOR" text2='UNINTERRUPTED SUPPLY.' bgUrl={'/logistics-bg.png'} />
          )}
        </div>
      </div>
    </Fade>
  )
}
