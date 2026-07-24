"use client";

import React, { useState, useEffect, useRef } from "react";
import { Phone, X, Volume2, User, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  speaker: string;
  text: string;
}

export default function TalkToUsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [status, setStatus] = useState<"idle" | "connecting" | "calling" | "active" | "completed" | "error">("idle");
  const [statusText, setStatusText] = useState("Request Live Callback");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [callSid, setCallSid] = useState<string | null>(null);
  const [meetingAppointed, setMeetingAppointed] = useState(false);
  const [callDuration, setCallDuration] = useState<string | null>(null);
  const [callCost, setCallCost] = useState<number | null>(null);
  const [secondsTalked, setSecondsTalked] = useState(0);
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  
  // Timer effect to count active conversation seconds
  useEffect(() => {
    if (status === "active") {
      setSecondsTalked(0);
      timerRef.current = setInterval(() => {
        setSecondsTalked((prev) => prev + 1);
      }, 1000);
    } else if (status === "completed" || status === "error") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => {
      setStatus("idle");
      setStatusText("Request Live Callback");
      setPhone("");
      setLanguage("en-IN");
      setTranscript([]);
      setCallSid(null);
      setMeetingAppointed(false);
      setCallDuration(null);
      setCallCost(null);
      setSecondsTalked(0);
      if (pollInterval.current) clearInterval(pollInterval.current);
      setIsOpen(true);
    };
    window.addEventListener("open-zara-modal", handleOpen);
    return () => window.removeEventListener("open-zara-modal", handleOpen);
  }, []);

  // Auto scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Clean up polling on unmount or close
  useEffect(() => {
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setStatus("connecting");
    setStatusText("Initiating call...");
    setTranscript([]);
    setCallSid(null);

    try {
      const formData = new FormData();
      formData.append("phone_number", phone);
      formData.append("language", language);

      const response = await fetch("/api/make-call", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.call_sid) {
        setCallSid(data.call_sid);
        setStatus("calling");
        setStatusText("Calling your phone...");
        startPolling(data.call_sid);
      } else {
        alert(data.error || "Failed to initiate call. Make sure backend is running.");
        resetState();
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Is the backend server running?");
      resetState();
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
            setStatus("active");
            setStatusText("Call in progress");
          } else if (data.status === "Completed") {
            setStatus("completed");
            setStatusText("Call completed");
            if (pollInterval.current) clearInterval(pollInterval.current);
          } else if (data.status === "Error" || data.status === "Not found") {
            setStatus("error");
            setStatusText("Call ended / failed");
            if (pollInterval.current) clearInterval(pollInterval.current);
          } else {
            setStatusText(`${data.status}...`);
          }
        }

        if (data.meeting_appointed) {
          setMeetingAppointed(true);
        }

        if (data.duration_formatted) {
          setCallDuration(data.duration_formatted);
        }

        if (data.cost_in_rupees !== undefined) {
          setCallCost(data.cost_in_rupees);
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

  const resetState = () => {
    setStatus("idle");
    setStatusText("Request Live Callback");
    setCallDuration(null);
    setCallCost(null);
    setSecondsTalked(0);
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-lg overflow-hidden bg-plaster border border-linen rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-linen flex justify-between items-center bg-white">
            <div>
              <h3 className="text-xl font-display font-semibold text-charcoal">
                Instant Design Callback
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Our AI design coordinator will call your phone immediately
              </p>
            </div>
            <button
              onClick={() => {
                resetState();
                setIsOpen(false);
              }}
              className="p-2 text-charcoal/60 hover:text-charcoal hover:bg-plaster rounded-full transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 overflow-y-auto flex flex-col space-y-6 bg-plaster/50">
            {status === "idle" && (
              <form onSubmit={handleCallSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="modalPhone" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
                    Enter Your Mobile Number (with +91)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-charcoal/50">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      id="modalPhone"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-linen rounded-2xl text-charcoal placeholder-charcoal/30 font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="modalLanguage" className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider">
                    Preferred Language
                  </label>
                  <select
                    id="modalLanguage"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-linen rounded-2xl text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-teak/50 transition-all duration-200"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="hi-Latn">Hinglish (Hindi/English mix)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-teak hover:bg-teak/90 text-white font-medium rounded-2xl shadow-lg shadow-teak/10 hover:shadow-teak/20 transition-all duration-200"
                >
                  <Phone size={18} />
                  Call Me Now
                </button>
              </form>
            )}

            {status !== "idle" && (
              <div className="flex flex-col flex-1 space-y-4">
                {/* Active calling indicator & pulse waves */}
                <div className="flex flex-col items-center justify-center py-4 bg-white border border-linen rounded-2xl shadow-sm p-4">
                  <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                    {status === "active" && (
                      <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-teak/20 animate-ping"></span>
                        <span className="absolute inline-flex h-12 w-12 rounded-full bg-teak/30 animate-pulse"></span>
                      </>
                    )}
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-teak text-white">
                      {status === "active" ? <Volume2 size={22} /> : <Phone size={22} className="animate-bounce" />}
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-charcoal">{statusText}</span>

                  {meetingAppointed && (
                    <div className="mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Your Design Consultation is Appointed!
                    </div>
                  )}

                  {status === "completed" && (
                    <div className="w-full mt-4 p-4 bg-teak/5 border border-linen rounded-2xl space-y-2.5 text-charcoal text-left">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-teak text-center">
                        Call Cost Summary
                      </h4>
                      <div className="border-t border-linen my-1.5"></div>
                      <div className="flex justify-between text-xs">
                        <span className="text-charcoal/60">Duration:</span>
                        <span className="font-semibold text-charcoal">
                          {secondsTalked >= 60 
                            ? `${Math.floor(secondsTalked / 60)}m ${secondsTalked % 60}s` 
                            : `${secondsTalked} seconds`}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-charcoal/60">Rate:</span>
                        <span className="font-semibold text-charcoal">₹5.70 / min</span>
                      </div>
                      <div className="border-t border-dashed border-linen my-1.5"></div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-teak">Total Cost:</span>
                        <span className="text-teak">₹{((secondsTalked / 60) * 5.70).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {status === "active" && (
                    <div className="flex items-center gap-1 mt-3">
                      <span className="w-1.5 h-6 bg-teak rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-1.5 h-8 bg-teak rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-1.5 h-5 bg-teak rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                      <span className="w-1.5 h-7 bg-teak rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  )}
                </div>

                {/* Live transcript container */}
                <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto border border-linen bg-white rounded-2xl p-4 space-y-4 shadow-inner">
                  {transcript.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Mic className="text-charcoal/20 mb-2 animate-pulse" size={28} />
                      <p className="text-xs text-charcoal/40 font-medium">
                        Waiting for conversation to begin...
                      </p>
                    </div>
                  ) : (
                    transcript.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.speaker === "Zara" ? "mr-auto" : "ml-auto flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                            msg.speaker === "Zara" ? "bg-teak text-white" : "bg-linen text-charcoal"
                          }`}
                        >
                          {msg.speaker === "Zara" ? "Z" : "U"}
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.speaker === "Zara"
                              ? "bg-plaster text-charcoal border border-linen rounded-tl-none"
                              : "bg-teak text-white rounded-tr-none"
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                            {msg.speaker}
                          </span>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={transcriptEndRef} />
                </div>

                {/* Reset button for ended state */}
                {(status === "completed" || status === "error") && (
                  <button
                    onClick={resetState}
                    className="w-full py-3 bg-linen hover:bg-linen/80 text-charcoal font-medium rounded-xl transition-colors duration-200"
                  >
                    Call Another Number
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-linen bg-white/50 text-center">
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-semibold">
              Powering conversations with Sunrise AI
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
