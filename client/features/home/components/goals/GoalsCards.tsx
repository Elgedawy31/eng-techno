import { FastOrderCard } from "./FastOrderCard";
import { PersonOrderCard } from "./PersonOrderCard";
import { CompanyOrderCard } from "./CompanyOrderCard";

export function GoalsCards() {
  return (
    <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full lg:w-[55%]">
      <FastOrderCard />
      <PersonOrderCard />
      <CompanyOrderCard />
    </div>
  );
}

