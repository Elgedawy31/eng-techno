import { PaymentGrid } from "./PaymentGrid";

export function PaymentSection() {
  return (
    <section id="payment-partners" className="relative w-full overflow-hidden mb-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center px-4">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-4 text-foreground">
            شركاء التمويل
          </h1>

          <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12 text-primary">
            جميع الجهات التمويلية المتاحة لدينا
          </h2>

          <PaymentGrid />
        </div>
      </div>
    </section>
  );
}

