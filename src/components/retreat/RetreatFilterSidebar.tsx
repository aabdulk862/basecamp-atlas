import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

interface RetreatFilterSidebarProps {
  // Filter state
  regions: string[];
  stayTypes: string[];
  priceRange: [number, number];
  maxDriveTime: number;
  selectedOrigin: string;
  minPrivacy: number;
  amenities: string[];
  // Setters
  setRegions: (regions: string[]) => void;
  setStayTypes: (types: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setMaxDriveTime: (time: number) => void;
  setSelectedOrigin: (origin: string) => void;
  setMinPrivacy: (privacy: number) => void;
  setAmenities: (amenities: string[]) => void;
  // Actions
  resetFilters: () => void;
  // Derived
  activeFilterCount: number;
  matchCount: number;
  // Available options
  availableRegions: { slug: string; name: string }[];
  availableOriginCities: { slug: string; name: string }[];
  availableStayTypes: string[];
}

const AMENITY_OPTIONS = [
  { id: 'hot tub', label: 'Hot Tub' },
  { id: 'fire pit', label: 'Fire Pit' },
  { id: 'sauna', label: 'Sauna' },
  { id: 'kitchen', label: 'Kitchen' },
];

function formatDriveTime(minutes: number): string {
  if (minutes >= 360) return '6h+';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function RetreatFilterSidebar({
  regions,
  stayTypes,
  priceRange,
  maxDriveTime,
  selectedOrigin,
  minPrivacy,
  amenities,
  setRegions,
  setStayTypes,
  setPriceRange,
  setMaxDriveTime,
  setSelectedOrigin,
  setMinPrivacy,
  setAmenities,
  resetFilters,
  activeFilterCount,
  matchCount,
  availableRegions,
  availableOriginCities,
  availableStayTypes,
}: RetreatFilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRegionToggle = (slug: string) => {
    if (regions.includes(slug)) {
      setRegions(regions.filter((r) => r !== slug));
    } else {
      setRegions([...regions, slug]);
    }
  };

  const handleStayTypeToggle = (type: string) => {
    if (stayTypes.includes(type)) {
      setStayTypes(stayTypes.filter((t) => t !== type));
    } else {
      setStayTypes([...stayTypes, type]);
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    if (amenities.includes(amenityId)) {
      setAmenities(amenities.filter((a) => a !== amenityId));
    } else {
      setAmenities([...amenities, amenityId]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: 'var(--surface-elevated)' }}>
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
          {/* Mobile collapse toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 md:hidden"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            )}
          </Button>
        </div>
      </div>

      {/* Filter content - collapsible on mobile */}
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Region multi-select */}
            <div className="space-y-3">
              <Label style={{ color: 'var(--text-primary)' }}>Region</Label>
              <div className="space-y-2">
                {availableRegions.map((region) => (
                  <div key={region.slug} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region.slug}`}
                      checked={regions.includes(region.slug)}
                      onCheckedChange={() => handleRegionToggle(region.slug)}
                    />
                    <label
                      htmlFor={`region-${region.slug}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {region.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stay type multi-select */}
            <div className="space-y-3">
              <Label style={{ color: 'var(--text-primary)' }}>Stay Type</Label>
              <div className="space-y-2">
                {availableStayTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`staytype-${type}`}
                      checked={stayTypes.includes(type)}
                      onCheckedChange={() => handleStayTypeToggle(type)}
                    />
                    <label
                      htmlFor={`staytype-${type}`}
                      className="text-sm font-medium leading-none cursor-pointer capitalize"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price range slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label style={{ color: 'var(--text-primary)' }}>Price Range</Label>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  ${priceRange[0]} – ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={50}
                max={1500}
                step={25}
                onValueChange={(val) => setPriceRange(val as [number, number])}
                className="my-4"
              />
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>$50</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>$1,500</span>
              </div>
            </div>

            {/* Drive time with origin selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label style={{ color: 'var(--text-primary)' }}>Max Drive Time</Label>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {formatDriveTime(maxDriveTime)}
                </span>
              </div>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger className="mb-2">
                  <SelectValue placeholder="Select origin city" />
                </SelectTrigger>
                <SelectContent>
                  {availableOriginCities.map((city) => (
                    <SelectItem key={city.slug} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Slider
                value={[maxDriveTime]}
                min={60}
                max={360}
                step={30}
                onValueChange={(val) => setMaxDriveTime(val[0])}
                className="my-4"
              />
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>1h</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>6h</span>
              </div>
            </div>

            {/* Privacy minimum */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label style={{ color: 'var(--text-primary)' }}>Min Privacy</Label>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {minPrivacy} / 5
                </span>
              </div>
              <Slider
                value={[minPrivacy]}
                min={1}
                max={5}
                step={1}
                onValueChange={(val) => setMinPrivacy(val[0])}
                className="my-4"
              />
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>1</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>5</span>
              </div>
            </div>

            {/* Amenity checkboxes */}
            <div className="space-y-3">
              <Label style={{ color: 'var(--text-primary)' }}>Amenities</Label>
              <div className="space-y-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={amenities.includes(amenity.id)}
                      onCheckedChange={() => handleAmenityToggle(amenity.id)}
                    />
                    <label
                      htmlFor={`amenity-${amenity.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}

      {/* Footer */}
      <div
        className="p-4 border-t"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-elevated)' }}
      >
        <p className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>
          {matchCount} {matchCount === 1 ? 'property' : 'properties'}
        </p>
      </div>
    </div>
  );
}
