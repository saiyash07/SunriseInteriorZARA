"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, X, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const projectsList = [
  {
    id: 1,
    title: "The Sage & Timber Retreat",
    category: "living-room",
    style: "Contemporary Indian",
    location: "Indiranagar, Bengaluru",
    images: ["/luxury_livingroom2.png", "/finished_luxury.png"],
    details: "A lush 3BHK living room transformation featuring a sage green fluted feature wall, cream L-shaped sectional sofa with terracotta accent cushions, warm recessed lighting coves, and a hand-curated art display shelf.",
    specs: "Area: 380 sq.ft | Materials: Fluted MDF Panels, Italian Marble Coffee Table, Teak Shelving"
  },
  {
    id: 2,
    title: "The Marble & Walnut Kitchen",
    category: "kitchen",
    style: "Luxury Modular",
    location: "Koramangala, Bengaluru",
    images: ["/luxury_kitchen.png", "/finished_luxury.png"],
    details: "An open-plan modular kitchen with a statement Calacatta marble island, slate-grey matte cabinetry with push-to-open mechanisms, triple pendant brass lights, and Hafele soft-close tandem drawer systems.",
    specs: "Area: 210 sq.ft | Materials: Calacatta Marble, Slate Grey Acrylic, Hafele Fittings, Brass Fixtures"
  },
  {
    id: 3,
    title: "The Walnut Suite Bedroom",
    category: "bedroom",
    style: "Hotel Luxury",
    location: "HSR Layout, Bengaluru",
    images: ["/luxury_bedroom.png", "/luxury_kitchen.png"],
    details: "A master bedroom sanctuary combining warm walnut-toned wardrobes with LED strip lighting, a plush king-size platform bed with floating under-bed glow, linen drapes with city views, and a bespoke dressing station.",
    specs: "Area: 260 sq.ft | Materials: Walnut Veneer, Egyptian Cotton Upholstery, Toughened Glass, Brass Handles"
  }
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projectsList[0] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const filteredProjects = filter === "all"
    ? projectsList
    : projectsList.filter(p => p.category === filter);

  return (
    <>
      <Header />

      <main className="flex-1 bg-plaster py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          {/* Header Title */}
          <div className="max-w-2xl space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
              Portfolio & Selected Works
            </h1>
            <p className="text-base text-charcoal/70 leading-relaxed font-sans">
              Browse through bespoke home transformations delivered across Bangalore. Filter by room type to find inspiration for your own renovation.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 border-b border-linen pb-4">
            {["all", "living-room", "kitchen", "bedroom"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 focus:outline-none ${
                  filter === cat
                    ? "bg-teak text-white shadow-md shadow-teak/10"
                    : "bg-white text-charcoal border border-linen hover:bg-plaster"
                }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSelectedProject(proj);
                    setActiveImageIndex(0);
                  }}
                  className="group cursor-pointer bg-white border border-linen rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col space-y-4"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-plaster">
                    <Image
                      src={proj.images[0]}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-base font-bold text-charcoal group-hover:text-teak transition-colors">
                        {proj.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal/50 font-semibold">
                      <MapPin size={12} className="text-teak" />
                      <span>{proj.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Project Details Modal Slider */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-plaster border border-linen rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
            >
              {/* Carousel side (Left / Top) */}
              <div className="md:col-span-7 relative h-[250px] md:h-full bg-charcoal min-h-[300px]">
                <Image
                  src={selectedProject.images[activeImageIndex]}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
                
                {/* Image Nav Arrows */}
                <div className="absolute inset-x-4 bottom-4 flex justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1));
                    }}
                    className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Specs side (Right / Bottom) */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-full">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teak bg-teak/10 px-2.5 py-1 rounded-full">
                      {selectedProject.style}
                    </span>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-1 hover:bg-linen rounded-full text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-charcoal leading-tight">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs text-charcoal/50 font-semibold flex items-center gap-1.5">
                      <MapPin size={12} className="text-teak" />
                      {selectedProject.location}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-charcoal/70 font-sans">
                    {selectedProject.details}
                  </p>

                  <div className="pt-4 border-t border-linen">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-charcoal/40 mb-1">Specifications</span>
                    <span className="text-[11px] leading-relaxed text-charcoal/80 font-medium">
                      {selectedProject.specs}
                    </span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-3 bg-charcoal hover:bg-charcoal/90 text-white text-xs font-semibold rounded-xl tracking-wider uppercase transition-colors"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
