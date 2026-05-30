import { motion } from "framer-motion";
import { Building2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const verticals = [
  {
    id: "live",
    title: "Live",
    description:
      "Find your next apartment with smart scoring, commute analysis, and neighborhood insights.",
    href: "/live",
    icon: Building2,
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.3)",
  },
  {
    id: "escape",
    title: "Escape",
    description:
      "Discover curated vacation retreats, villas, and getaways with privacy and wow factor.",
    href: "/escape",
    icon: Compass,
    accentColor: "#eab308",
    glowColor: "rgba(234, 179, 8, 0.3)",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function VerticalCards() {
  return (
    <section className="px-6 py-20 md:py-28">
      <motion.div
        className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {verticals.map((vertical) => {
          const Icon = vertical.icon;
          return (
            <motion.a
              key={vertical.id}
              href={vertical.href}
              variants={cardVariants}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border p-8",
                "transition-all duration-200",
                "hover:scale-[1.03]"
              )}
              style={{
                backgroundColor: "var(--surface-base, #0f172a)",
                borderColor: "var(--border-subtle, rgba(30, 41, 59, 0.6))",
                "--card-accent": vertical.accentColor,
                "--card-glow": vertical.glowColor,
              } as React.CSSProperties}
              whileHover={{
                boxShadow: `0 0 24px 4px ${vertical.glowColor}`,
              }}
            >
              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `color-mix(in srgb, ${vertical.accentColor} 15%, transparent)`,
                }}
              >
                <Icon
                  className="h-6 w-6"
                  style={{ color: vertical.accentColor }}
                  aria-hidden="true"
                />
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold tracking-wide"
                style={{
                  color: "var(--text-primary, #e2e8f0)",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {vertical.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary, #94a3b8)" }}
              >
                {vertical.description}
              </p>

              {/* Accent bar */}
              <div
                className="mt-auto h-1 w-12 rounded-full transition-all duration-200 group-hover:w-20"
                style={{ backgroundColor: vertical.accentColor }}
                aria-hidden="true"
              />
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
