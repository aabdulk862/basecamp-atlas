import { useRef, useEffect, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import type { SerializedProperty } from '@/components/retreat/RetreatBrowse';

export interface PropertySummaryCardProps {
  property: SerializedProperty;
  onClose: () => void;
}

export function truncateWowFactor(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

function CardBody({ property }: { property: SerializedProperty }) {
  const detailUrl = `/escape/${property.region}/${property.slug}`;
  const priceDisplay = `$${property.priceRange.min}–$${property.priceRange.max}/night`;
  const wowExcerpt = truncateWowFactor(property.wowFactor);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
        <span>{property.region}</span>
      </div>

      <div className="text-sm">
        <span className="font-semibold text-[var(--accent-primary)]">
          {priceDisplay}
        </span>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        {wowExcerpt}
      </p>

      <a
        href={detailUrl}
        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:text-[var(--accent-tertiary)] transition-colors"
      >
        View details
        <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
}

function DesktopCard({ property, onClose }: PropertySummaryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'rounded-lg border',
        'bg-[var(--surface-elevated)] border-[var(--border-subtle)]',
        'p-3 shadow-lg'
      )}
      style={{ maxWidth: 'min(250px, calc(100vw - 32px))' }}
      role="dialog"
      aria-label={`Property summary: ${property.name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)] leading-tight">
          {property.name}
        </h3>
        <button
          onClick={onClose}
          className="shrink-0 p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close summary card"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <CardBody property={property} />
    </div>
  );
}

function MobileDrawerCard({ property, onClose }: PropertySummaryCardProps) {
  return (
    <Drawer open onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85dvh] bg-[var(--surface-elevated)] border-[var(--border-subtle)]">
        <DrawerHeader className="text-left">
          <div className="flex items-start justify-between gap-2">
            <DrawerTitle className="text-base font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading,Playfair_Display)]">
              {property.name}
            </DrawerTitle>
            <DrawerClose asChild>
              <button
                className="shrink-0 p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close summary card"
              >
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Property summary for {property.name}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 max-w-[calc(100vw-32px)]">
          <CardBody property={property} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function PropertySummaryCard({ property, onClose }: PropertySummaryCardProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDrawerCard property={property} onClose={onClose} />;
  }

  return <DesktopCard property={property} onClose={onClose} />;
}
