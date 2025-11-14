"use client";

import { Fade } from "react-awesome-reveal";
import { useCoreValuesSection } from "@/features/coreValuesSection/hooks/useCoreValuesSection";

export default function CoreValuesHeader() {
  const { coreValuesSection } = useCoreValuesSection();
  
  const label = coreValuesSection?.label || "CORE VALUES";
  const heading = coreValuesSection?.heading || 
    "At Amstone International Group, our work is guided by a set of non-negotiable values that define who we are and how we serve.";

  return (
    <Fade direction="up" duration={800} triggerOnce>
      <div className="w-2/3 mb-16">
        <h1 className='text-3xl text-[#C3996C] flex items-center mb-3'>
          <span className='text-2xl'>{"//"}</span>
          {label}
        </h1>
        <p className='text-4xl font-medium'>
          {heading}
        </p>
      </div>
    </Fade>
  );
}

