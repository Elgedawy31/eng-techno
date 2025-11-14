import { WhyText } from "./WhyText";
import { WhyCards } from "./WhyCards";

export function WhyChooseUsSection() {
  return (
    <section 
      id="why-choose-us" 
      className="relative w-full bg-primary py-6 md:py-8 lg:py-12"
      aria-label="لماذا تختار شركة أوتو باور"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6 sm:gap-8 lg:gap-12">
          <WhyText />
          <WhyCards />
        </div>
      </div>
    </section>
  );
}

