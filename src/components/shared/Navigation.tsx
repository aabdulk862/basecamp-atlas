import { useState, useRef } from "react";
import type { VerticalConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

interface NavigationProps {
  verticals: VerticalConfig[];
  activeVertical: string | null;
}

export default function Navigation({ verticals, activeVertical }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const sortedVerticals = [...verticals].sort((a, b) => a.order - b.order);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--surface-base, #0f172a) 85%, transparent)",
          borderBottom: "1px solid var(--border-subtle, rgba(30, 41, 59, 0.6))",
        }}
        aria-label="Main navigation"
      >
        {/* Brand mark */}
        <a
          href="/"
          className="text-lg font-bold tracking-wide transition-opacity hover:opacity-80"
          style={{
            color: "var(--text-primary, #e2e8f0)",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Basecamp Atlas
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {sortedVerticals.map((vertical) => {
            const isActive = activeVertical === vertical.id;
            return (
              <a
                key={vertical.id}
                href={vertical.routePrefix}
                className={cn(
                  "relative px-1 py-1 text-sm font-medium transition-colors",
                  isActive ? "font-semibold" : "hover:opacity-80"
                )}
                style={{
                  color: isActive
                    ? "var(--accent-primary, #38bdf8)"
                    : "var(--text-secondary, #94a3b8)",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {vertical.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "var(--accent-primary, #38bdf8)" }}
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile hamburger toggle */}
        <button
          ref={toggleButtonRef}
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:opacity-80 md:hidden"
          style={{ color: "var(--text-primary, #e2e8f0)" }}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        verticals={verticals}
        activeVertical={activeVertical}
        toggleButtonRef={toggleButtonRef}
      />
    </>
  );
}
