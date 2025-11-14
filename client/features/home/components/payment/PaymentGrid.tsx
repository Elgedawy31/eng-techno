import Image from "next/image";

// Payment partner images array for better maintainability and SEO
const paymentPartners = [
  { src: "/payments/pay1.svg", alt: "شريك تمويلي - شركة تمويل 1" },
  { src: "/payments/pay2.svg", alt: "شريك تمويلي - شركة تمويل 2" },
  { src: "/payments/pay3.svg", alt: "شريك تمويلي - شركة تمويل 3" },
  { src: "/payments/pay4.svg", alt: "شريك تمويلي - شركة تمويل 4" },
  { src: "/payments/pay5.svg", alt: "شريك تمويلي - شركة تمويل 5" },
  { src: "/payments/pay6.svg", alt: "شريك تمويلي - شركة تمويل 6" },
  { src: "/payments/pay7.svg", alt: "شريك تمويلي - شركة تمويل 7" },
  { src: "/payments/pay8.svg", alt: "شريك تمويلي - شركة تمويل 8" },
  { src: "/payments/pay11.svg", alt: "شريك تمويلي - شركة تمويل 9" },
  { src: "/payments/pay22.svg", alt: "شريك تمويلي - شركة تمويل 10" },
  { src: "/payments/pay33.svg", alt: "شريك تمويلي - شركة تمويل 11" },
  { src: "/payments/pay44.svg", alt: "شريك تمويلي - شركة تمويل 12" },
  { src: "/payments/pay55.svg", alt: "شريك تمويلي - شركة تمويل 13" },
  { src: "/payments/pay66.svg", alt: "شريك تمويلي - شركة تمويل 14" },
  { src: "/payments/pay77.svg", alt: "شريك تمويلي - شركة تمويل 15" },
  { src: "/payments/pay88.svg", alt: "شريك تمويلي - شركة تمويل 16" },
  { src: "/payments/pay111.svg", alt: "شريك تمويلي - شركة تمويل 17" },
  { src: "/payments/pay222.svg", alt: "شريك تمويلي - شركة تمويل 18" },
  { src: "/payments/pay333.svg", alt: "شريك تمويلي - شركة تمويل 19" },
  { src: "/payments/pay444.svg", alt: "شريك تمويلي - شركة تمويل 20" },
  { src: "/payments/pay555.svg", alt: "شريك تمويلي - شركة تمويل 21" },
  { src: "/payments/pay666.svg", alt: "شريك تمويلي - شركة تمويل 22" },
  { src: "/payments/pay777.svg", alt: "شريك تمويلي - شركة تمويل 23" },
  { src: "/payments/pay888.svg", alt: "شريك تمويلي - شركة تمويل 24" },
] as const;

export function PaymentGrid() {
  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-[60px] gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-y-12 w-full"
      style={{ direction: "rtl" }}
    >
      {paymentPartners.map((partner, index) => (
        <div
          key={index}
          className="relative w-full aspect-square flex items-center justify-center group"
        >
          <Image
            src={partner.src}
            alt={partner.alt}
            width={120}
            height={120}
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            loading="lazy"
            quality={90}
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16.66vw, 12.5vw"
          />
        </div>
      ))}
    </div>
  );
}

