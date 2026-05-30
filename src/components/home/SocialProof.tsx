import { useRef, useEffect, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
}

export interface SocialProofProps {
  metrics: Metric[];
}

const ANIMATION_DURATION_MS = 2000;

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix?: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);

      // Ease-out cubic for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [value]);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      animate();
    }
  }, [inView, animate]);

  return (
    <span>
      {displayValue}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export function SocialProof({ metrics }: SocialProofProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-20 px-6",
        "bg-[var(--surface-base)]"
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={cn(
                "flex flex-col items-center text-center",
                "rounded-xl border border-white/10 bg-white/5 p-8",
                "transition-opacity duration-500",
                isInView ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="text-4xl font-bold tracking-tight text-[var(--accent-primary)] sm:text-5xl">
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  inView={isInView}
                />
              </span>
              <span className="mt-2 text-sm font-medium uppercase tracking-widest text-white/60">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
