"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
      startTimeRef.current = Date.now();
      const startValue = 0;

      const updateCount = () => {
        if (!shouldStartRef.current || !startTimeRef.current) {
          return;
        }

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        
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

      requestAnimationFrame(() => {
        setCount(0);
        animationRef.current = requestAnimationFrame(updateCount);
      });
    } else if (!shouldStart) {
      startTimeRef.current = null;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
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

const cards = [
  {
    icon: "/like.svg",
    value: 98,
    label: ["نسبة رضا", "العملاء"],
  },
  {
    icon: "/certificate.svg",
    value: 99,
    label: ["أفضل سعر", "تنافسي"],
  },
  {
    icon: "/successpayment.svg",
    value: 86,
    label: ["عملية تمويل", "ناجحة"],
  },
];

export function WhyCards() {
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
      className="flex flex-row items-stretch justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full lg:w-[65%]"
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6 flex-1 min-w-0 bg-card rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10"
        >
          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 shrink-0">
            <Image
              src={card.icon}
              alt=""
              width={72}
              height={72}
              className="w-full h-full object-contain"
              quality={100}
              aria-hidden="true"
            />
          </div>
          
          <div className="flex-1 flex items-center justify-center min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px]">
            <h3 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none text-brand text-center">
              <CountUp end={card.value} suffix="%" shouldStart={startCount} />
            </h3>
          </div>
          
          <h4 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-primary text-center leading-tight shrink-0">
            {card.label.map((line, i) => (
              <span key={i}>
                {line}
                {i < card.label.length - 1 && <br />}
              </span>
            ))}
          </h4>
        </div>
      ))}
    </div>
  );
}

