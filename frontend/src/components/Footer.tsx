"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {

  return (
    <>
      <footer className="w-full bg-charcoal text-linen/70 border-t border-charcoal/20">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-widest text-white">
                SUNRISE
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-teak -mt-1">
                Interiors & Design
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-linen/50 max-w-xs">
              Designing premium homes, modular kitchens, and custom luxury interiors across India since 2018. Rooted in clean lines, natural wood accents, and fine craftsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-teak transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teak transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-teak transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teak transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-display">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-teak flex-shrink-0" />
                <span>Sector 5, HSR Layout, Bengaluru, Karnataka 560102</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-teak flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-teak flex-shrink-0" />
                <span>hello@sunriseinteriors.com</span>
              </li>
            </ul>
          </div>

          {/* Interactive CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-display">
              Instant AI Call
            </h4>
            <p className="text-xs text-linen/40 leading-relaxed">
              Curious about design options or starting a modular project? Talk with our AI coordinator, Zara, right now.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teak hover:bg-teak/90 text-white font-semibold text-xs rounded-xl shadow-lg shadow-teak/10 transition-all duration-200"
            >
              <Phone size={14} />
              Receive a Call Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-linen/10 py-6 bg-charcoal/95">
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-wider text-linen/40 font-semibold space-y-4 md:space-y-0">
            <span>© {new Date().getFullYear()} Sunrise Interiors. All rights reserved.</span>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-teak">Instagram</a>
              <a href="#" className="hover:text-teak">Facebook</a>
              <a href="#" className="hover:text-teak">Pinterest</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
