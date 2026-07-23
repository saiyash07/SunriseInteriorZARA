"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneCall, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-linen bg-plaster/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group flex flex-col focus:outline-none">
            <span className="font-display text-2xl font-bold tracking-widest text-charcoal group-hover:text-teak transition-colors duration-200">
              SUNRISE
            </span>
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-charcoal/50 group-hover:text-teak/70 transition-colors duration-200 -mt-1">
              Interiors & Design
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none ${
                    isActive ? "text-teak" : "text-charcoal/70 hover:text-charcoal"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-teak"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
              className="flex items-center gap-2 px-5 py-2.5 bg-teak hover:bg-teak/95 text-white font-medium text-sm rounded-full shadow-lg shadow-teak/5 hover:shadow-teak/15 transition-all duration-200 focus:outline-none"
            >
              <PhoneCall size={14} />
              Request Call Back
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-charcoal/80 hover:text-charcoal hover:bg-linen/50 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-linen bg-plaster"
            >
              <div className="px-6 py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-charcoal/80 hover:text-charcoal"
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-zara-modal"));
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-teak text-white font-semibold rounded-xl mt-2"
                >
                  <PhoneCall size={16} />
                  Request Call Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
