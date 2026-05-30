"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Mountain } from "lucide-react";

const TAGLINE = "Live Anywhere. Escape Everywhere.";
const VALUE_PROPOSITION =
  "A lifestyle discovery platform pairing city apartment living with curated nature retreats — all within driving distance.";

const fadeSlideUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "linear-gradient(180deg, hsl(222 47% 7%) 0%, hsl(222 47% 11%) 50%, hsl(220 40% 9%) 100%)",
      }}
      aria-label="Hero"
    >
      {/* Subtle radial glow accent */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, hsla(199 89% 48% / 0.06), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Tagline */}
        <motion.h1
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          style={{
            color: "var(--text-primary, #e2e8f0)",
            fontFamily: "var(--font-heading)",
          }}
          {...fadeSlideUp}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {TAGLINE}
        </motion.h1>

        {/* Value Proposition */}
        <motion.p
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed sm:text-xl"
          style={{
            color: "var(--text-secondary, #94a3b8)",
            fontFamily: "var(--font-body)",
          }}
          {...fadeSlideUp}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          {VALUE_PROPOSITION}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          {...fadeSlideUp}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <a
            href="/live"
            className={cn(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2",
              "rounded-lg px-6 py-3 text-base font-medium",
              "transition-all duration-200 hover:scale-[1.03] hover:brightness-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
            style={{
              backgroundColor: "hsl(199 89% 48%)",
              color: "#ffffff",
              fontFamily: "var(--font-body)",
            }}
          >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            Find Apartments
          </a>

          <a
            href="/escape"
            className={cn(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2",
              "rounded-lg px-6 py-3 text-base font-medium",
              "transition-all duration-200 hover:scale-[1.03] hover:brightness-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
            style={{
              backgroundColor: "hsl(36 55% 50%)",
              color: "#ffffff",
              fontFamily: "var(--font-body)",
            }}
          >
            <Mountain className="h-5 w-5" aria-hidden="true" />
            Discover Retreats
          </a>
        </motion.div>
      </div>
    </section>
  );
}
