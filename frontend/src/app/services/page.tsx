"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { motion } from "framer-motion";
import { Sparkles, Hammer, ShieldCheck, Flame, Compass, ChevronRight, Phone } from "lucide-react";

const serviceCategories = [
  {
    id: "kitchens",
    title: "Bespoke Modular Kitchens",
    description: "Highly functional layouts (U-Shape, L-Shape, Parallel, Island) customized to Indian culinary styles, utilizing water-resistant marine ply and easy-to-clean finishes.",
    costRange: "Starting from ₹1.8 Lakhs to ₹5.5 Lakhs+",
    features: [
      "Boiling Water Resistant (BWR) Marine Plywood cabinets",
      "Premium European Soft-Close Hinges and Drawer Runners",
      "Custom Quartz countertops with integrated sink options",
      "Intelligent storage systems (tall units, corner carousels, oil pullouts)"
    ],
    tiers: [
      { name: "Classic Matte", price: "₹1.8L - ₹2.5L", details: "Premium laminate finish, basic corner accessories, stainless steel wire baskets." },
      { name: "High-Gloss Acrylic", price: "₹2.6L - ₹4.0L", details: "Seamless acrylic finish cabinets, soft-close tandem boxes, profile handles." },
      { name: "Luxury Glass & PU", price: "₹4.2L+", details: "Colored lacquered glass shutters, PU painted panels, automated lift-ups, smart tall-units." }
    ]
  },
  {
    id: "wardrobes",
    title: "Premium Custom Wardrobes",
    description: "Floor-to-ceiling customized storage systems. Choose from swing doors or smooth sliding mechanisms matching your bedroom's color palette.",
    costRange: "Starting from ₹85,000 to ₹3.0 Lakhs+",
    features: [
      "Custom internal configurations (shelves, vaults, drawer organizers)",
      "High-grade plywood framework with dual-side laminates",
      "Soft-close sliding channel systems (Hettich/Hafele)",
      "Integrated LED sensor profile lighting inside hanging rods"
    ],
    tiers: [
      { name: "Swing Door Laminate", price: "₹85k - ₹1.4L", details: "High-density ply shutters, premium laminates, custom aluminum profile edge-banding." },
      { name: "Sliding Acrylic", price: "₹1.5L - ₹2.5L", details: "Space-saving sliding shutters, high-gloss acrylic or lacquer finishes, integrated handles." },
      { name: "Luxury Glass Slider", price: "₹2.6L+", details: "Tinted translucent or colored glass panels, slim profile black frames, leather-wrapped drawers." }
    ]
  },
  {
    id: "full-home",
    title: "Turnkey Full-Home Interiors",
    description: "End-to-end design, production, and project management for apartments and villas. Includes modular cabinets, electrical adjustments, false ceilings, lighting, and painting.",
    costRange: "Starting from ₹4.5 Lakhs (2BHK) / ₹6.5 Lakhs (3BHK)",
    features: [
      "Dedicated senior designer for floor plans and 3D renders",
      "45-day factory-to-site delivery guarantee",
      "10-year warranty on all modular products",
      "Comprehensive on-site coordination and paint supervision"
    ],
    tiers: [
      { name: "Standard 2BHK Package", price: "Starting at ₹4.5 Lakhs", details: "Modular kitchen, sliding wardrobe in master bedroom, false ceiling in living room, TV unit, basic lighting." },
      { name: "Standard 3BHK Package", price: "Starting at ₹6.5 Lakhs", details: "Modular kitchen, two wardrobes, false ceiling in living + dining, TV unit, study table, full apartment painting." },
      { name: "Elite Curated Package", price: "Custom Quote", details: "Bespoke PU/glass finishes, full wallpaper and paneling, modern custom false ceilings, automation hooks." }
    ]
  }
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("kitchens");

  const activeData = serviceCategories.find(c => c.id === activeCategory)!;

  return (
    <>
      <Header />

      <main className="flex-1 bg-plaster py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          {/* Header Description */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
              Bespoke Interior Services & Pricing
            </h1>
            <p className="text-base text-charcoal/70 leading-relaxed font-sans">
              We design modular systems that last. Transparent tier-based pricing with starting cost estimates so you can plan your renovation budget without surprises.
            </p>
          </div>

          {/* Quick Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-linen pb-4">
            {serviceCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 focus:outline-none ${
                  activeCategory === c.id
                    ? "bg-teak text-white shadow-lg shadow-teak/10"
                    : "bg-white text-charcoal border border-linen hover:bg-plaster"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Category Detail Card */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-linen rounded-3xl p-8 md:p-12 shadow-xl shadow-charcoal/5"
          >
            {/* Left Specs */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teak">Service Details</span>
              <h2 className="font-display text-3xl font-bold text-charcoal">{activeData.title}</h2>
              <p className="text-sm text-charcoal/70 leading-relaxed font-sans">{activeData.description}</p>
              
              <div className="p-4 bg-plaster border border-linen rounded-2xl">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-1">Estimated Cost Range</span>
                <span className="text-lg font-bold text-teak">{activeData.costRange}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60">What's Included:</h4>
                <ul className="space-y-2.5">
                  {activeData.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-charcoal/80 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-teak rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Tiers List */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-linen lg:pl-10">
              <span className="text-xs font-bold uppercase tracking-widest text-teak">Pricing Tiers</span>
              <div className="space-y-4">
                {activeData.tiers.map((tier, idx) => (
                  <div key={idx} className="p-5 border border-linen hover:border-teak/30 rounded-2xl bg-plaster/30 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-display text-sm font-bold text-charcoal">{tier.name}</span>
                      <span className="text-xs font-bold text-teak">{tier.price}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-charcoal/60">{tier.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Core Guarantees Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            {[
              { icon: ShieldCheck, title: "10-Year Warranty", desc: "Rigorous quality checks. All modular systems are covered under a comprehensive 10-year warranty." },
              { icon: Flame, title: "Fire & Water Resistant", desc: "We strictly use high-grade marine ply that resists moisture absorption, swelling, and thermal stress." },
              { icon: Compass, title: "Design Customization", desc: "No pre-set template models. Every drawer depth, wardrobe shelf, and kitchen corner is configured around you." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-white border border-linen rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-teak/10 text-teak flex-shrink-0 flex items-center justify-center">
                  <item.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-charcoal font-display">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-charcoal/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick AI Dialer CTA */}
          <div className="bg-charcoal text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teak">Direct Consultation</span>
              <h3 className="font-display text-2xl font-bold leading-tight">
                Want to customize a package or calculate custom dimensions?
              </h3>
              <p className="text-xs text-linen/50 leading-relaxed font-sans">
                Call Zara now. She will calculate estimated modular rates based on your bedroom and kitchen measurements in 30 seconds.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
              className="flex items-center gap-2 px-8 py-4 bg-teak hover:bg-teak/95 text-white font-semibold rounded-full shadow-lg transition-colors flex-shrink-0"
            >
              <Phone size={16} />
              Request Call Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
