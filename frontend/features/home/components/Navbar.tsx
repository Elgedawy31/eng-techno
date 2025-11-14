import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu } from 'lucide-react';

const links = [
  { href: "/about-us", label: " ABOUT US" },
  { href: "/solutions", label: "SOLUTIONS" },
  { href: "/services", label: "SERVICES" },
  { href: "/manufacturing", label: "MANUFACTURING" },
  { href: "/partnerships", label: "PARTNERSHIPS" },
  { href: "/media-centre", label: "MEDIA CENTRE" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {

  return (
    <nav className=" top-0 z-50 flex items-center justify-between py-8 w-full px-70">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-white transition-transform duration-300 hover:scale-110"
        >
          <Image src='/logo.svg' alt="Logo" width={58} height={58}/>
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium text-white leading-[100%] flex items-center gap-1",
                "relative transition-all duration-300 ease-in-out",
                "hover:text-white/90 hover:translate-y-[-2px]",
                "group"
              )}
            >
              <span className="relative">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
              {(link.label === "SOLUTIONS" || link.label === "SERVICES") && (
                <Menu 
                  width={24} 
                  height={16}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Language Switch */}
        <div className="flex items-center gap-2">
          <button className="text-sm font-semibold text-white transition-all duration-300 hover:scale-110 hover:opacity-80">
            EN
          </button>
          <button className="text-sm font-semibold text-white/60 transition-all duration-300 hover:scale-110 hover:text-white hover:opacity-80">
            FR
          </button>
        </div>
    </nav>
  );
}
