"use client";

import { useEffect, useRef, useState } from "react";

const formatNumberToArabic = (value: number): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(value).replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

function CountUp({ end, duration = 2, prefix = "", suffix = "", shouldStart = false }: CountUpProps & { shouldStart: boolean }) {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const shouldStartRef = useRef(shouldStart);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    shouldStartRef.current = shouldStart;
    
    if (shouldStart && !startTimeRef.current) {
      // Start animation
      startTimeRef.current = Date.now();
      const startValue = 0;

      const updateCount = () => {
        if (!shouldStartRef.current || !startTimeRef.current) {
          return;
        }

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (end - startValue) * easeOutQuart);
        
        setCount(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(updateCount);
        } else {
          setCount(end);
          startTimeRef.current = null;
        }
      };

      // Defer setState to avoid synchronous call in effect
      requestAnimationFrame(() => {
        setCount(0);
        animationRef.current = requestAnimationFrame(updateCount);
      });
    } else if (!shouldStart) {
      // Reset when shouldStart becomes false
      startTimeRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Defer setState to avoid synchronous call in effect
      requestAnimationFrame(() => {
        setCount(0);
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, shouldStart]);

  return <>{prefix}{formatNumberToArabic(count)}{suffix}</>;
}

export function AboutCards() {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full "
    >
      {/* Card 1: Brands */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 aspect-square bg-card rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 sm:p-4 md:p-6">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 sm:mb-2 leading-none text-brand text-center">
          <CountUp end={15} prefix="+" shouldStart={startCount} />
        </h1>
        <h2 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-none text-center text-primary">
          علامة تجارية
        </h2>
      </div>

      {/* Card 2: Financing */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 aspect-square bg-card rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 sm:p-4 md:p-6">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 sm:mb-2 leading-none text-brand text-center">
          <CountUp end={25} prefix="+" shouldStart={startCount} />
        </h1>
        <h2 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-none text-center text-primary">
          جهة تمويلية
        </h2>
      </div>

      {/* Card 3: Delivery Speed */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 aspect-square bg-card rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 sm:p-4 md:p-6">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-1 sm:mb-2 leading-none text-brand text-center">
          <CountUp end={99} suffix="%" shouldStart={startCount} />
        </h1>
        <h2 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-none text-center text-primary">
          سرعة تسليم
        </h2>
      </div>
    </div>
  );
}

