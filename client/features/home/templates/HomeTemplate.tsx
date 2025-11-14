import { AboutSection } from "../components/about/AboutSection";
import { CarSectionsSection } from "../components/CarSectionsSection";
import { ContactSection } from "../components/ContactSection";
import { HeroSection } from "../components/HeroSection";
import { WhyChooseUsSection } from "../components/whyus/WhyChooseUsSection";
import { GoalsSection } from "@/features/home/components/goals/GoalsSection";
import { PaymentSection } from "../components/payment/PaymentSection";

function HomeTemplate() {
  return (
    <main className="flex flex-col gap-12">
      <HeroSection />
      <AboutSection />
      <CarSectionsSection />
      <WhyChooseUsSection />
      <ContactSection />
      <GoalsSection />
      <PaymentSection />
    </main>
  );
}

export default HomeTemplate;
