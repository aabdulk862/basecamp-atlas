import { useEffect, useRef, useCallback } from "react";
import type { VerticalConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  verticals: VerticalConfig[];
  activeVertical: string | null;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
  cities?: { name: string; slug: string }[];
  destinations?: { name: string; slug: string }[];
}

export function MobileMenu({
  isOpen,
  onClose,
  verticals,
  activeVertical,
  toggleButtonRef,
  cities,
  destinations,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: cycle focus within the menu when open
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const menu = menuRef.current;
        if (!menu) return;

        const focusableElements = menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  // Set up keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus the close button when menu opens, return focus to toggle on close
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the menu is rendered
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen, toggleButtonRef]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sortedVerticals = [...verticals].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "var(--surface-base, #0f172a)" }}
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between px-6 py-4">
        <a
          href="/"
          className="text-lg font-bold tracking-wide"
          style={{ color: "var(--text-primary, #e2e8f0)", fontFamily: "Playfair Display, serif" }}
        >
          Basecamp Atlas
        </a>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:opacity-80"
          style={{ color: "var(--text-primary, #e2e8f0)" }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6">
        {sortedVerticals.map((vertical) => {
          const isActive = activeVertical === vertical.id;
          return (
            <a
              key={vertical.id}
              href={vertical.routePrefix}
              className={cn(
                "text-2xl font-medium transition-colors",
                isActive ? "font-bold" : "hover:opacity-80"
              )}
              style={{
                color: isActive
                  ? "var(--accent-primary, #38bdf8)"
                  : "var(--text-secondary, #94a3b8)",
                fontFamily: "Playfair Display, serif",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {vertical.name}
            </a>
          );
        })}

        {/* City links */}
        {cities && cities.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted, #64748b)" }}
            >
              Cities
            </span>
            {cities.map((city) => (
              <a
                key={city.slug}
                href={`/live/${city.slug}`}
                className="text-lg font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary, #94a3b8)" }}
              >
                {city.name}
              </a>
            ))}
          </div>
        )}

        {/* Destination links */}
        {destinations && destinations.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-muted, #64748b)" }}
            >
              Destinations
            </span>
            {destinations.map((destination) => (
              <a
                key={destination.slug}
                href={`/escape/destinations/${destination.slug}`}
                className="text-lg font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary, #94a3b8)" }}
              >
                {destination.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
