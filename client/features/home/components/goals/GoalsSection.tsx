import { GoalsText } from "./GoalsText";
import { GoalsCards } from "./GoalsCards";

export function GoalsSection() {
  return (
    <section 
      id="goals" 
      className="relative w-full bg-primary py-8 md:py-12 lg:py-16"
      aria-label="أهدافنا - طلب السيارة"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-12" dir="rtl">
          <GoalsText />
          <GoalsCards />
        </div>
      </div>
    </section>
  );
}

