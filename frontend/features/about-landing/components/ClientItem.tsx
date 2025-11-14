"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { ClientPartner } from "@/features/clientPartner/services/clientPartnerService";

interface ClientItemProps {
  client: ClientPartner;
  index: number;
}

export default function ClientItem({ client, index }: ClientItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-[#808285]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 py-4 text-left group hover:opacity-80 transition-opacity"
      >
        <Plus 
          size={60} 
          strokeWidth={0.5}
          className={`text-[#808285] flex-shrink-0 transition-all duration-300 ${
            isExpanded ? 'rotate-45 text-white' : 'hover:text-white'
          }`}
        />
        <span className="text-white text-xl uppercase font-medium flex-1">
          {client.name}
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded && client.description ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {client.description && (
          <div className="pb-4 pl-8 pt-2">
            <p className="text-white text-base leading-relaxed mb-4">
              {client.description}
            </p>
            {client.emblemImage && (
              <div className="relative w-24 h-24">
                <Image
                  src={client.emblemImage}
                  alt={`${client.name} emblem`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

