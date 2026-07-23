"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Hammer, Users, HeartHandshake, Sparkles, Phone } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {

  return (
    <>
      <Header />

      <main className="flex-1 bg-plaster py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          {/* Header Title */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
              Rooted in Material, Focused on Craft.
            </h1>
            <p className="text-base text-charcoal/70 leading-relaxed font-sans">
              Sunrise Interiors was founded in Bangalore with a singular mission: to strip away the plastic and veneer laminates commonly used in modern apartments and return to the textures, warmth, and resilience of natural wood.
            </p>
          </div>

          {/* Core Philosophy Section (Split screen with image context) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-linen p-8 md:p-12 rounded-3xl shadow-sm">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-teak">Our Story</span>
              <h2 className="font-display text-3xl font-bold text-charcoal">
                Designed locally, built to survive generations.
              </h2>
              <div className="space-y-4 text-xs leading-relaxed text-charcoal/70 font-sans">
                <p>
                  Most modular interiors sold today are built around paper-thin laminates and particle board cores. We believed there was a better way to design homes in HSR Layout and surrounding communities.
                </p>
                <p>
                  At Sunrise, we source our materials from sustainable timber farms in Southern India and fabricate all cabinet components in our state-of-the-art carpentry unit. Every edge is sealed with precision profile banding, and we use only high-density, boiling-water-resistant plywood frames.
                </p>
                <p>
                  Our design approach focuses on organic minimalism. We believe a home should feel quiet, bright, and deeply comfortable, relying on natural daylight and wood tones rather than artificial clutter.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-linen bg-plaster">
              <Image
                src="/finished_luxury.png"
                alt="Sunrise Interiors design studio finished work"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Guiding Principles Grid */}
          <div className="space-y-8">
            <h3 className="font-display text-2xl font-bold text-charcoal text-center">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Hammer, title: "Artisan Quality", text: "Every cabinet shutter and custom wardrobe trim is finished by our local craftsmen, bringing years of woodworking experience to your home." },
                { icon: Users, title: "Indian Living Focus", text: "We understand Indian homes. We customize modular drawers for spices, dry-goods storage, high-moisture layouts, and wardrobe storage templates." },
                { icon: HeartHandshake, title: "Complete Transparency", text: "No hidden charges, no material substitutions. We list your specifications explicitly in our contracts and give you factory-visit access during fabrication." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-linen p-8 rounded-2xl space-y-4 hover:border-teak/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-teak/10 text-teak flex items-center justify-center">
                    <item.icon size={22} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-charcoal">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-charcoal/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Call Banner */}
          <div className="bg-charcoal text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teak">Get a Callback</span>
              <h3 className="font-display text-2xl font-bold leading-tight">
                Want to speak with a design partner directly?
              </h3>
              <p className="text-xs text-linen/50 leading-relaxed font-sans">
                Book a consultation with Zara. Our voice coordinator will arrange a free 30-minute studio walkthrough to showcase actual wood samples and mockups.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-zara-modal"))}
              className="flex items-center gap-2 px-8 py-4 bg-teak hover:bg-teak/95 text-white font-semibold rounded-full shadow-lg transition-colors flex-shrink-0"
            >
              <Phone size={16} />
              Book Callback
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
