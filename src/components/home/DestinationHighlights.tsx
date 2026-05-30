"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Globe } from "lucide-react";

export interface DestinationHighlightsProps {
  regions: { name: string; slug: string }[];
  destinations: { name: string; slug: string; scope: "us" | "international" }[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function DestinationHighlights({
  regions,
  destinations,
}: DestinationHighlightsProps) {
  const usDestinations = destinations.filter((d) => d.scope === "us");
  const internationalDestinations = destinations.filter(
    (d) => d.scope === "international"
  );

  return (
    <section
      className="px-6 py-20 md:py-28"
      aria-label="Destination Highlights"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2
            className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{
              color: "var(--text-primary, #e2e8f0)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Where We Roam
          </h2>
          <p
            className="mx-auto max-w-lg text-base leading-relaxed"
            style={{ color: "var(--text-secondary, #94a3b8)" }}
          >
            Explore curated regions and destinations across the US and beyond.
          </p>
        </motion.div>

        {/* Regions grid */}
        {regions.length > 0 && (
          <div className="mb-14">
            <motion.h3
              className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
              style={{ color: "var(--text-secondary, #94a3b8)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Regions
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {regions.map((region) => (
                <motion.a
                  key={region.slug}
                  href={`/escape/${region.slug}`}
                  variants={itemVariants}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border p-4",
                    "transition-all duration-200",
                    "hover:scale-[1.02] hover:border-white/20"
                  )}
                  style={{
                    backgroundColor: "var(--surface-base, #0f172a)",
                    borderColor: "var(--border-subtle, rgba(30, 41, 59, 0.6))",
                  }}
                  whileHover={{
                    boxShadow: "0 0 16px 2px rgba(234, 179, 8, 0.12)",
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: "color-mix(in srgb, #eab308 12%, transparent)",
                    }}
                  >
                    <MapPin
                      className="h-4 w-4"
                      style={{ color: "#eab308" }}
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary, #e2e8f0)" }}
                  >
                    {region.name}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        )}

        {/* Destinations grouped by scope */}
        {destinations.length > 0 && (
          <div className="space-y-10">
            {/* US Destinations */}
            {usDestinations.length > 0 && (
              <div>
                <motion.h3
                  className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-secondary, #94a3b8)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  US Destinations
                </motion.h3>

                <motion.div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {usDestinations.map((dest) => (
                    <motion.a
                      key={dest.slug}
                      href={`/escape/destinations/${dest.slug}`}
                      variants={itemVariants}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border p-4",
                        "transition-all duration-200",
                        "hover:scale-[1.02] hover:border-white/20"
                      )}
                      style={{
                        backgroundColor: "var(--surface-base, #0f172a)",
                        borderColor: "var(--border-subtle, rgba(30, 41, 59, 0.6))",
                      }}
                      whileHover={{
                        boxShadow: "0 0 16px 2px rgba(59, 130, 246, 0.12)",
                      }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: "color-mix(in srgb, #3b82f6 12%, transparent)",
                        }}
                      >
                        <MapPin
                          className="h-4 w-4"
                          style={{ color: "#3b82f6" }}
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary, #e2e8f0)" }}
                      >
                        {dest.name}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            )}

            {/* International Destinations */}
            {internationalDestinations.length > 0 && (
              <div>
                <motion.h3
                  className="mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                  style={{ color: "var(--text-secondary, #94a3b8)" }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  International Destinations
                </motion.h3>

                <motion.div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {internationalDestinations.map((dest) => (
                    <motion.a
                      key={dest.slug}
                      href={`/escape/destinations/${dest.slug}`}
                      variants={itemVariants}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border p-4",
                        "transition-all duration-200",
                        "hover:scale-[1.02] hover:border-white/20"
                      )}
                      style={{
                        backgroundColor: "var(--surface-base, #0f172a)",
                        borderColor: "var(--border-subtle, rgba(30, 41, 59, 0.6))",
                      }}
                      whileHover={{
                        boxShadow: "0 0 16px 2px rgba(20, 184, 166, 0.12)",
                      }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: "color-mix(in srgb, #14b8a6 12%, transparent)",
                        }}
                      >
                        <Globe
                          className="h-4 w-4"
                          style={{ color: "#14b8a6" }}
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary, #e2e8f0)" }}
                      >
                        {dest.name}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
