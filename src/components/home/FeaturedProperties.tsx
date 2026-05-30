"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Sparkles } from "lucide-react";

export interface FeaturedProperty {
  name: string;
  slug: string;
  region: string;
  priceRange: { min: number; max: number };
  wowFactor: string;
  stayType: string;
}

export interface FeaturedPropertiesProps {
  properties: FeaturedProperty[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
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

/** Deterministic gradient based on property name for image placeholder */
function getPlaceholderGradient(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1} 40% 18%) 0%, hsl(${hue2} 50% 12%) 100%)`;
}

function formatPrice(min: number, max: number): string {
  return `$${min}–$${max}/night`;
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  if (properties.length === 0) {
    return null;
  }

  // Clamp to 3–6 properties
  const displayed = properties.slice(0, 6);

  return (
    <section className="px-6 py-20 md:py-28" aria-label="Featured Properties">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.h2
          className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          style={{
            color: "var(--text-primary, #e2e8f0)",
            fontFamily: "Playfair Display, serif",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Featured Escapes
        </motion.h2>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <motion.div
          className={cn(
            // Mobile: horizontal scroll with snap
            "flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4",
            "md:grid md:grid-cols-2 md:overflow-x-visible md:snap-none md:pb-0",
            "lg:grid-cols-3"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {displayed.map((property) => (
            <motion.a
              key={property.slug}
              href={`/escape/${property.region}/${property.slug}`}
              variants={cardVariants}
              className={cn(
                "group flex-shrink-0 snap-start",
                "w-[280px] md:w-auto",
                "flex flex-col overflow-hidden rounded-xl border",
                "transition-all duration-200 hover:scale-[1.02]"
              )}
              style={{
                backgroundColor: "var(--surface-base, #0f172a)",
                borderColor: "var(--border-subtle, rgba(30, 41, 59, 0.6))",
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative h-40 w-full"
                style={{ background: getPlaceholderGradient(property.name) }}
                aria-hidden="true"
              >
                {/* Stay type badge */}
                <span
                  className={cn(
                    "absolute left-3 top-3 rounded-full px-2.5 py-1",
                    "text-xs font-medium capitalize"
                  )}
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "var(--text-primary, #e2e8f0)",
                  }}
                >
                  {property.stayType}
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                {/* Name */}
                <h3
                  className="text-base font-semibold leading-tight"
                  style={{
                    color: "var(--text-primary, #e2e8f0)",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {property.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5">
                  <MapPin
                    className="h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: "var(--text-muted, #64748b)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-sm capitalize"
                    style={{ color: "var(--text-secondary, #94a3b8)" }}
                  >
                    {property.region.replace(/-/g, " ")}
                  </span>
                </div>

                {/* Price */}
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--accent-primary, #eab308)" }}
                >
                  {formatPrice(property.priceRange.min, property.priceRange.max)}
                </span>

                {/* Wow factor */}
                <div className="mt-auto flex items-start gap-1.5 pt-2">
                  <Sparkles
                    className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                    style={{ color: "var(--accent-primary, #eab308)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="line-clamp-2 text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary, #94a3b8)" }}
                  >
                    {property.wowFactor}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
