"use client";

import { Fade } from "react-awesome-reveal";
import ClientItem from "./ClientItem";
import { useClientPartners } from "@/features/clientPartner/hooks/useClientPartners";
import { useClientsPartnersSection } from "@/features/clientsPartnersSection/hooks/useClientsPartnersSection";
import type { ClientPartner } from "@/features/clientPartner/services/clientPartnerService";

interface OurClientsProps {
  title?: string;
  description?: string;
  clients?: ClientPartner[];
}

export default function OurClients({ 
  title,
  description,
  clients
}: OurClientsProps) {
  // Use hooks if data is not provided via props
  const { clientPartners } = useClientPartners();
  const { clientsPartnersSection } = useClientsPartnersSection();
  
  // Use props data or fallback to hook data
  const displayTitle = title || clientsPartnersSection?.title || "OUR CLIENTS & PARTNERS";
  const displayDescription = description || clientsPartnersSection?.description || 
    "Partnerships are the cornerstone of our success. We collaborate with governments, ministries of defense, and leading defense manufacturers to strengthen security worldwide.";
  const displayClients = clients || clientPartners;
  
  // Filter active clients and sort by order
  const activeClients = displayClients
    .filter(client => client.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="w-full h-full bg-black text-white  px-20">
      <div className="flex"
      style={{ backgroundImage: `url(/our-clients-bg.svg)` }}
      >
        
        {/* Left Column - Title and Description */}
       <div className="flex py-25 pr-20 gap-60">
       <Fade direction="up" duration={800} triggerOnce>
          <div className="">
            <h1 className="text-6xl font-bold mb-6 uppercase font-heading">
              {displayTitle}
            </h1>
            <p className="text-xl leading-relaxed text-white/90">
              {displayDescription}
            </p>
          </div>
        </Fade>

        {/* Right Column - Client List */}
        <Fade direction="up" duration={800} delay={200} triggerOnce>
          <div className="">
            {activeClients.length > 0 ? (
              <div className="space-y-0">
                {activeClients.map((client, index) => (
                  <ClientItem 
                    key={client._id} 
                    client={client} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white/60">No clients available</p>
            )}
          </div>
        </Fade>
       </div>
      </div>
    </div>
  );
}

