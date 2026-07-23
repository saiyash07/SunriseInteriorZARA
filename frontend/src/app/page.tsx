"use client";

import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Phone, Star, Sparkles, Layout, Home, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Bespoke Modular Kitchens",
    desc: "Intelligent layout plans matching Indian culinary needs. Premium marine ply cabinets with soft-close hardware.",
    icon: Sparkles,
    price: "Starting from ₹1.8 Lakhs",
  },
  {
    title: "Custom Wardrobes & Storage",
    desc: "Floor-to-ceiling sliding wardrobe options with high-quality laminate, acrylic, or tinted glass finishes.",
    icon: Layout,
    price: "Starting from ₹85,000",
  },
  {
    title: "Complete Home Makeovers",
    desc: "Turnkey design-and-build package for 2BHK/3BHK flats, covering false ceilings, painting, lighting, and decor.",
    icon: Home,
    price: "Starting from ₹4.5 Lakhs",
  },
];

const projects = [
  {
    title: "The Marble & Walnut Kitchen",
    location: "Koramangala, Bengaluru",
    image: "/luxury_kitchen.png",
    style: "Luxury Modular",
  },
  {
    title: "The Walnut Suite Bedroom",
    location: "HSR Layout, Bengaluru",
    image: "/luxury_bedroom.png",
    style: "Hotel Luxury",
  },
];

export default function HomePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-plaster py-20 md:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-teak/10 text-teak text-xs font-bold tracking-widest uppercase rounded-full"
              >
                <Sparkles size={12} />
                Bespoke Craftsmanship
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal leading-[1.1]"
              >
                Crafting spaces with raw material & soul.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base text-charcoal/70 leading-relaxed font-sans max-w-lg"
              >
                No templates. No compromises. We design modern Indian homes focused on natural textures, warm wood tones, and intelligent spatial flow.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-teak hover:bg-teak/95 text-white font-semibold rounded-full shadow-lg shadow-teak/10 hover:shadow-teak/20 transition-all duration-200"
                >
                  <Phone size={16} />
                  Request Call Back
                </button>
                <Link
                  href="/portfolio"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-linen hover:bg-plaster text-charcoal font-semibold rounded-full transition-colors duration-200"
                >
                  Explore Portfolio
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            {/* Right Interactive Before/After Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex flex-col space-y-4"
            >
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative w-full h-[380px] md:h-[500px] overflow-hidden rounded-3xl shadow-xl border border-linen select-none cursor-ew-resize"
              >
                {/* Unfinished Concrete Room (Background) */}
                <div className="absolute inset-0">
                  <Image
                    src="/raw_concrete.png"
                    alt="Unfinished room shell"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    Before: Concrete Shell
                  </div>
                </div>

                {/* Finished Luxury Living Room (Foreground Overlay) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-0 w-[calc(100vw-48px)] lg:w-[700px] h-full">
                    <Image
                      src="/finished_luxury.png"
                      alt="Finished luxury living room"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-teak text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">
                    After: Sunrise Interiors Design
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 bg-white text-charcoal rounded-full border border-linen flex items-center justify-center shadow-lg pointer-events-none select-none font-bold text-xs">
                    ↔
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-charcoal/50 font-medium">
                Drag or hover across the frame to reveal the room transformation
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-white border-t border-linen">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold tracking-widest text-teak uppercase mb-2">Our Offerings</h2>
              <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
                Thoughtfully designed interior modules matching Indian modern apartments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-plaster border border-linen p-8 rounded-3xl hover:border-teak/30 hover:shadow-xl hover:shadow-teak/5 transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-linen flex items-center justify-center text-teak group-hover:bg-teak group-hover:text-white transition-colors duration-300">
                      <item.icon size={22} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-charcoal">{item.title}</h3>
                    <p className="text-sm text-charcoal/70 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-linen flex justify-between items-center text-xs font-semibold text-charcoal">
                    <span>{item.price}</span>
                    <ChevronRight size={16} className="text-teak" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects Gallery */}
        <section className="py-24 bg-plaster border-t border-linen">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="max-w-xl">
                <h2 className="text-xs font-bold tracking-widest text-teak uppercase mb-2">Portfolio Showcase</h2>
                <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-charcoal">
                  Featured design projects delivered across South Bangalore.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="flex items-center gap-1.5 text-sm font-semibold text-teak hover:text-teak/80"
              >
                View all projects
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((proj, idx) => (
                <div key={idx} className="group relative flex flex-col space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-linen bg-white">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-start px-2">
                    <div>
                      <h3 className="font-display text-lg font-bold text-charcoal">{proj.title}</h3>
                      <p className="text-xs text-charcoal/50 font-semibold">{proj.location}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teak bg-teak/10 px-2.5 py-1 rounded-full">
                      {proj.style}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-white border-t border-linen">
          <div className="mx-auto max-w-7xl px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-teak uppercase">Our Journey</h2>
              <p className="font-display text-3xl font-bold tracking-tight text-charcoal">
                From raw floor plan to handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "Design Consultation", text: "Book an online or on-site meeting to share floor plans and define your lifestyle needs." },
                { step: "3D Renders & Plan", text: "Walk through photorealistic 3D visual models showing exactly how materials and lighting look." },
                { step: "Precision Crafting", text: "All modular cabinets are engineered in our HSR Layout factory to ensure seamless edges." },
                { step: "Handover in 45 Days", text: "Our local supervisors manage on-site installation and hand over your ready-to-live home." }
              ].map((item, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="text-2xl font-bold text-teak/30 font-display">0{idx + 1}</div>
                  <h3 className="font-display text-lg font-bold text-charcoal">{item.step}</h3>
                  <p className="text-xs leading-relaxed text-charcoal/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Call CTA Section */}
        <section className="py-20 bg-charcoal text-white relative overflow-hidden">
          {/* Muted green brand highlight overlay */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-forest/30 rounded-full blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-5xl px-6 relative z-10 text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teak">Ready to Begin?</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                Instantly connect with our lead designer right now.
              </h2>
              <p className="text-sm text-linen/60 font-sans leading-relaxed">
                Click below to request an AI call. Zara will ring your phone immediately to talk about design options, layout configs, and estimate project budgets.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-teak hover:bg-teak/95 text-white font-semibold rounded-full shadow-lg transition-colors duration-200"
              >
                <Phone size={16} />
                Request Call Back
              </button>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors duration-200"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
