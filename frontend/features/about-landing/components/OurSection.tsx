"use client";

import OurImageAndText from './OurImage&Text'
import { useMissionVision } from '@/features/missionVision/hooks/useMissionVision'

export default function OurSection() {
  const { missionVision } = useMissionVision();
  
  const missionTitle = missionVision?.missionTitle || "OUR MISSION";
  const missionDescription = missionVision?.missionDescription || 
    "To reinforce national defense capabilities by delivering state-of-the-art military equipment, innovative security solutions, and expert consultancy services that safeguard nations and support mission success.";
  const missionImage = missionVision?.missionImage || "/our1.png";
  const missionLogoImage = missionVision?.missionLogoImage || "/search-logo.png";
  
  const visionTitle = missionVision?.visionTitle || "OUR VISION";
  const visionDescription = missionVision?.visionDescription || 
    "To be recognized as the world's most trusted defense partner, providing advanced solutions that empower military and law enforcement agencies, while driving global stability and security.";
  const visionImage = missionVision?.visionImage || "/our2.png";
  const visionLogoImage = missionVision?.visionLogoImage || "/search-logo.png";

  return (
    <div>
      <OurImageAndText 
        title={missionTitle}
        text={missionDescription}
        img={missionImage}
        logoImage={missionLogoImage}
      />
      <OurImageAndText 
        title={visionTitle}
        text={visionDescription}
        img={visionImage}
        logoImage={visionLogoImage}
      />
    </div>
  )
}
