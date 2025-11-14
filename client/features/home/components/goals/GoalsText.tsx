export function GoalsText() {
  return (
    <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start gap-3 sm:gap-4 lg:gap-5">
      <h2 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center lg:text-right leading-tight">
        عارف هدفك؟
        <br />
        احنا نساعدك توصله!
      </h2>
      
      <p className="font-medium text-base sm:text-lg md:text-xl lg:text-xl text-white text-center lg:text-right leading-relaxed">
        كل اللي عليك ترسل لنا تفاصيل السيارة، وحنا نقدم لك أفضل العروض اللي
        تناسب طلبك.
      </p>
      
      <p className="font-normal text-sm sm:text-base md:text-lg lg:text-base text-white/95 text-center lg:text-right leading-relaxed">
        اختر نموذج التواصل المناسب وقم بارفاق التفاصيل وسيتم التواصل معك في
        أقل من ٢٤ ساعة.
      </p>
    </div>
  );
}

