import Image from "next/image";
import { AboutCards } from "./AboutCards";

export function AboutSection() {
  return (
    <section id="about" className="relative w-full overflow-hidden ">
      <div className="absolute top-[30%] left-0 right-0 z-0 opacity-20">
        <div className="relative w-full h-full">
          <Image
            src="/backgroundvector.png"
            alt=""
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            quality={90}
            priority={false}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="container mx-auto ">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16">
          {/* Text Content Section */}
          <div className="flex flex-col w-full lg:w-1/2 z-40 items-center lg:items-start text-center lg:text-right justify-between">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4 lg:mb-6">
              شركة أوتو باور
            </h1>

            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-foreground text-center lg:text-justify w-full mb-4 lg:mb-6 leading-relaxed">
              موزع معتمد لأفضل وأشهر العلامات التجارية للسيارات في المملكة
              العربية السعودية.
            </h2>

            <p className="font-medium text-base sm:text-lg md:text-xl text-foreground/90 text-justify leading-relaxed mb-6 lg:mb-8">
              تلتزم الشركة بتقديم تجربة استثنائية لعملائها في جميع أنحاء المملكة من
              خلال توفير جميع احتياجاتهم وتقديم خدمات مميزة لما بعد البيع، بهدف تحقيق
              أعلى مستويات رضا العملاء. تستند رؤية الشركة إلى الإرادة القوية والموثوقية،
              حيث تسعى إلى بناء الثقة مع كل عميل، وتلبية احتياجاته بسرعة وكفاءة، مع
              توفير التسهيلات اللازمة بأسعار تنافسية.
            </p>

            <AboutCards />
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 z-10 flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-lg aspect-4/5 lg:aspect-3/4">
              <Image
                src="/men.png"
                alt="شركة أوتو باور - فريق العمل"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
