"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Volume2, Mic } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  speaker: string;
  text: string;
}

export default function ContactPage() {
  const [phone, setPhone] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "calling" | "active" | "completed" | "error">("idle");
  const [statusText, setStatusText] = useState("Request Live Callback");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [callSid, setCallSid] = useState<string | null>(null);
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setCallStatus("connecting");
    setStatusText("Initiating call...");
    setTranscript([]);
    setCallSid(null);

    try {
      const formData = new FormData();
      formData.append("phone_number", phone);

      const response = await fetch("/api/make-call", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.call_sid) {
        setCallSid(data.call_sid);
        setCallStatus("calling");
        setStatusText("Calling your phone...");
        startPolling(data.call_sid);
      } else {
        alert(data.error || "Failed to initiate call. Make sure backend is running.");
        resetCallState();
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Is the backend server running?");
      resetCallState();
    }
  };

  const startPolling = (sid: string) => {
    let lastLength = 0;
    if (pollInterval.current) clearInterval(pollInterval.current);

    pollInterval.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/transcript/${sid}`);
        const data = await response.json();

        if (data.status) {
          if (data.status === "Active") {
            setCallStatus("active");
            setStatusText("Call in progress");
          } else if (data.status === "Completed") {
            setCallStatus("completed");
            setStatusText("Call completed");
            if (pollInterval.current) clearInterval(pollInterval.current);
          } else if (data.status === "Error" || data.status === "Not found") {
            setCallStatus("error");
            setStatusText("Call ended / failed");
            if (pollInterval.current) clearInterval(pollInterval.current);
          } else {
            setStatusText(`${data.status}...`);
          }
        }

        if (data.transcript && data.transcript.length > lastLength) {
          setTranscript(data.transcript);
          lastLength = data.transcript.length;
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 1000);
  };

  const resetCallState = () => {
    setCallStatus("idle");
    setStatusText("Request Live Callback");
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  return (
    <>
      <Header />

      <main className="flex-1 bg-plaster py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          {/* Header Description */}
          <div className="max-w-2xl space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
              Get in Touch
            </h1>
            <p className="text-base text-charcoal/70 leading-relaxed font-sans">
              Have questions about our modular ranges, materials, or want to book a designer consultation? Fill out our form below, or trigger our AI agent to call your phone instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Form & Info (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Form Card */}
              <div className="bg-white border border-linen p-8 rounded-3xl shadow-sm space-y-6">
                <h3 className="font-display text-xl font-bold text-charcoal">Send Us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold text-charcoal/60 uppercase">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder="Arjun Kumar"
                        className="w-full px-4 py-3 bg-plaster border border-linen rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-charcoal/60 uppercase">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="arjun@gmail.com"
                        className="w-full px-4 py-3 bg-plaster border border-linen rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-semibold text-charcoal/60 uppercase">Message / Requirements</label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Tell us about your home (2BHK, 3BHK, Modular Kitchen plans)..."
                      className="w-full px-4 py-3 bg-plaster border border-linen rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-charcoal hover:bg-charcoal/90 text-white font-semibold text-xs rounded-xl transition-colors duration-200"
                  >
                    <Send size={14} />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2 p-5 bg-white border border-linen rounded-2xl shadow-sm">
                  <MapPin size={18} className="text-teak" />
                  <h4 className="text-xs font-bold text-charcoal font-display">Design Studio</h4>
                  <p className="text-[10px] text-charcoal/60 leading-relaxed">
                    Sector 5, HSR Layout, Bengaluru, KA 560102
                  </p>
                </div>
                <div className="flex flex-col space-y-2 p-5 bg-white border border-linen rounded-2xl shadow-sm">
                  <Phone size={18} className="text-teak" />
                  <h4 className="text-xs font-bold text-charcoal font-display">Call Us</h4>
                  <p className="text-[10px] text-charcoal/60 leading-relaxed">
                    +91 98765 43210
                  </p>
                </div>
                <div className="flex flex-col space-y-2 p-5 bg-white border border-linen rounded-2xl shadow-sm">
                  <Mail size={18} className="text-teak" />
                  <h4 className="text-xs font-bold text-charcoal font-display">Email</h4>
                  <p className="text-[10px] text-charcoal/60 leading-relaxed">
                    hello@sunriseinteriors.com
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Talk to Us Dialer & Live Transcript (5 Cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white border border-linen p-8 rounded-3xl shadow-sm flex flex-col space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-charcoal">Talk to Zara (AI Dialer)</h3>
                  <p className="text-xs text-charcoal/50 mt-1">
                    Receive an instant callback to discuss your design plans.
                  </p>
                </div>

                {callStatus === "idle" && (
                  <form onSubmit={handleCallSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="contactPhone" className="block text-[10px] font-bold text-charcoal/60 uppercase">
                        Mobile Number (with country code)
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-plaster border border-linen rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-teak hover:bg-teak/95 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
                    >
                      <Phone size={14} />
                      Request Live Callback
                    </button>
                  </form>
                )}

                {callStatus !== "idle" && (
                  <div className="space-y-4">
                    {/* Call Status Header */}
                    <div className="p-4 border border-linen bg-plaster rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-teak text-white">
                          {callStatus === "active" && <span className="absolute inline-flex h-full w-full rounded-full bg-teak/30 animate-ping"></span>}
                          <Volume2 size={16} />
                        </div>
                        <span className="text-xs font-bold text-charcoal">{statusText}</span>
                      </div>
                      {(callStatus === "completed" || callStatus === "error") && (
                        <button
                          onClick={resetCallState}
                          className="text-[10px] font-bold uppercase tracking-wider text-teak hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Live Transcript Display */}
                    <div className="min-h-[200px] max-h-[250px] overflow-y-auto border border-linen rounded-2xl p-4 bg-plaster/30 space-y-3 shadow-inner">
                      {transcript.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <Mic className="text-charcoal/20 mb-2 animate-pulse" size={24} />
                          <p className="text-[10px] text-charcoal/40 font-semibold uppercase tracking-wider">
                            Connecting audio feed...
                          </p>
                        </div>
                      ) : (
                        transcript.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex gap-2 max-w-[85%] ${
                              msg.speaker === "Zara" ? "mr-auto" : "ml-auto flex-row-reverse"
                            }`}
                          >
                            <div
                              className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                                msg.speaker === "Zara"
                                  ? "bg-white text-charcoal border border-linen rounded-tl-none"
                                  : "bg-teak text-white rounded-tr-none"
                              }`}
                            >
                              <span className="block text-[8px] font-bold uppercase tracking-widest opacity-60 mb-0.5">
                                {msg.speaker}
                              </span>
                              {msg.text}
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={transcriptEndRef} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Map Embed Placeholder */}
          <div className="w-full h-80 rounded-3xl overflow-hidden border border-linen shadow-sm relative">
            {/* High quality map styling placeholder */}
            <div className="absolute inset-0 bg-linen flex flex-col items-center justify-center text-center p-6 space-y-2">
              <MapPin size={32} className="text-teak animate-bounce" />
              <h4 className="font-display text-base font-bold text-charcoal">Sunrise Interiors Studio Map</h4>
              <p className="text-xs text-charcoal/50 max-w-sm">
                Sector 5, HSR Layout, Bengaluru, Karnataka 560102. Located next to HSR Club.
              </p>
              <div className="w-full max-w-md h-1 bg-charcoal/10 rounded-full overflow-hidden mt-4">
                <div className="w-2/3 h-full bg-teak rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
