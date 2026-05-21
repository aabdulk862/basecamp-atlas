import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Navigation, X } from 'lucide-react';
import type { CommuteDestination } from '@/hooks/use-commute';

interface CommuteSelectorProps {
  destination: CommuteDestination | null;
  presets: CommuteDestination[];
  onSelect: (dest: CommuteDestination | null) => void;
}

export function CommuteSelector({ destination, presets, onSelect }: CommuteSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Navigation className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commute To</span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={destination?.label ?? '__none__'}
          onValueChange={(val) => {
            if (val === '__none__') {
              onSelect(null);
            } else {
              const preset = presets.find(p => p.label === val);
              if (preset) onSelect(preset);
            }
          }}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select workplace..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {presets.map((p) => (
              <SelectItem key={p.label} value={p.label}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {destination && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onSelect(null)}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {destination && (
        <p className="text-[10px] text-muted-foreground">
          Showing estimated drive & transit times to {destination.label}
        </p>
      )}
    </div>
  );
}
