"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    src: "/hero-1.jpg",
    alt: "Hero Image 1",
  },
  {
    src: "/hero-2.jpg",
    alt: "Hero Image 2",
  },
];

export function HeroSection() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(heroImages.length).fill(false)
  );

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <section id="hero" className="relative w-full h-[60vh] sm:h-[70vh] md:h-screen max-h-[800px] overflow-hidden group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        onSwiper={setSwiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={1000}
        className="h-full w-full"
        pagination={false}
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index} className="relative h-full w-full">
            {/* Background placeholder - shows while image is loading */}
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-500",
                imagesLoaded[index] ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            </div>

            {/* Optimized Image */}
            <div className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                quality={85}
                onLoad={() => handleImageLoad(index)}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* Overlay linear for better text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        onClick={() => swiper?.slidePrev()}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary backdrop-blur-sm rounded-full p-2.5 md:p-3.5 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/90 hover:bg-primary backdrop-blur-sm rounded-full p-2.5 md:p-3.5 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
      </button>

      {/* Slide Indicators with Primary Color */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => swiper?.slideTo(index)}
            className={cn(
              "rounded-full transition-all duration-300 hover:scale-110",
              activeIndex === index
                ? "h-2.5 md:h-3 w-8 md:w-10 bg-primary shadow-lg shadow-primary/50"
                : "h-2 md:h-2.5 w-2 md:w-2.5 bg-primary/40 hover:bg-primary/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Optional: Hero Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg transition-opacity duration-1000">
            مرحباً بك في عالم السيارات
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-md transition-opacity duration-1000">
            اكتشف مجموعتنا المميزة من السيارات
          </p>
        </div>
      </div>
    </section>
  );
}

