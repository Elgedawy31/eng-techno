"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FastOrderCard() {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 flex-1 min-w-0 bg-card rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 aspect-[0.75]">
      <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-foreground text-center leading-tight shrink-0">
        نموذج طلب
        <br />
        سريع
      </h3>

      <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-1 shrink-0">
        <Image
          src="/fastorder.svg"
          alt="نموذج طلب سريع"
          width={72}
          height={72}
          className="w-full h-full object-contain"
          quality={100}
        />
      </div>

      <div className="w-full shrink-0">
        <Button 
          className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all"
          asChild
        >
          <Link href="/request?type=fast" className="w-full">
            تقديم طلب
          </Link>
        </Button>
      </div>
    </div>
  );
}

