import { neighborhoods, washerDryerOptions } from '@/data/apartments';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from 'lucide-react';
import { WeightEditor } from '@/components/WeightEditor';
import { CommuteSelector } from '@/components/CommuteSelector';
import type { SortOption } from '@/hooks/use-apartment-filters';
import type { useScoreWeights } from '@/hooks/use-score-weights';
import type { useCommute } from '@/hooks/use-commute';

interface FilterSidebarProps {
  rentRange: [number, number];
  selectedNeighborhoods: string[];
  washerDryer: string;
  safetyScore: number;
  walkabilityScore: number;
  transitScore: number;
  entertainmentScore: number;
  sortBy: SortOption;
  maxDistance: number;
  activeFilterCount: number;
  matchCount: number;
  setRentRange: (val: [number, number]) => void;
  handleNeighborhoodToggle: (n: string) => void;
  setWasherDryer: (val: string) => void;
  setSafetyScore: (val: number) => void;
  setWalkabilityScore: (val: number) => void;
  setTransitScore: (val: number) => void;
  setEntertainmentScore: (val: number) => void;
  setSortBy: (val: SortOption) => void;
  setMaxDistance: (val: number) => void;
  handleReset: () => void;
  scoreWeights: ReturnType<typeof useScoreWeights>;
  commute: ReturnType<typeof useCommute>;
}

export function FilterSidebar({
  rentRange,
  selectedNeighborhoods,
  washerDryer,
  safetyScore,
  walkabilityScore,
  transitScore,
  entertainmentScore,
  sortBy,
  maxDistance,
  activeFilterCount,
  matchCount,
  setRentRange,
  handleNeighborhoodToggle,
  setWasherDryer,
  setSafetyScore,
  setWalkabilityScore,
  setTransitScore,
  setEntertainmentScore,
  setSortBy,
  setMaxDistance,
  handleReset,
  scoreWeights,
  commute,
}: FilterSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">Filters</h1>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-muted-foreground hover:text-foreground">
            Reset all
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Rent Range</Label>
              <span className="text-sm font-medium">${rentRange[0]} - ${rentRange[1]}</span>
            </div>
            <Slider
              value={rentRange}
              min={850}
              max={1900}
              step={50}
              onValueChange={(val) => setRentRange(val as [number, number])}
              className="my-4"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Distance from Uptown</Label>
              <span className="text-sm font-medium">{maxDistance >= 10 ? 'Any' : `≤${maxDistance} mi`}</span>
            </div>
            <Slider
              value={[maxDistance]}
              min={1}
              max={10}
              step={1}
              onValueChange={(val) => setMaxDistance(val[0])}
              className="my-4"
            />
          </div>

          <div className="space-y-3">
            <Label>Neighborhoods</Label>
            <div className="grid grid-cols-2 gap-2">
              {neighborhoods.map((n) => (
                <div key={n} className="flex items-center space-x-2">
                  <Checkbox
                    id={`neighborhood-${n}`}
                    checked={selectedNeighborhoods.includes(n)}
                    onCheckedChange={() => handleNeighborhoodToggle(n)}
                  />
                  <label
                    htmlFor={`neighborhood-${n}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                  >
                    {n}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Washer/Dryer</Label>
            <Select value={washerDryer} onValueChange={setWasherDryer}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {washerDryerOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="block mb-2">Minimum Scores (1-10)</Label>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Safety</span>
                <span className="text-xs font-medium">{safetyScore}+</span>
              </div>
              <Slider min={1} max={10} step={1} value={[safetyScore]} onValueChange={(val) => setSafetyScore(val[0])} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Walkability</span>
                <span className="text-xs font-medium">{walkabilityScore}+</span>
              </div>
              <Slider min={1} max={10} step={1} value={[walkabilityScore]} onValueChange={(val) => setWalkabilityScore(val[0])} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Transit</span>
                <span className="text-xs font-medium">{transitScore}+</span>
              </div>
              <Slider min={1} max={10} step={1} value={[transitScore]} onValueChange={(val) => setTransitScore(val[0])} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Entertainment</span>
                <span className="text-xs font-medium">{entertainmentScore}+</span>
              </div>
              <Slider min={1} max={10} step={1} value={[entertainmentScore]} onValueChange={(val) => setEntertainmentScore(val[0])} />
            </div>
          </div>

          <div className="space-y-3 pb-6">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Overall Score">Overall Score</SelectItem>
                <SelectItem value="Rent Low-High">Rent Low-High</SelectItem>
                <SelectItem value="Rent High-Low">Rent High-Low</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Walkability">Walkability</SelectItem>
                <SelectItem value="Transit">Transit</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personalized Score Weights */}
          <div className="border-t border-border pt-4">
            <WeightEditor
              weights={scoreWeights.weights}
              isCustom={scoreWeights.isCustom}
              onWeightsChange={scoreWeights.setWeights}
              onReset={scoreWeights.resetWeights}
            />
          </div>

          {/* Commute Calculator */}
          <div className="border-t border-border pt-4 pb-6">
            <CommuteSelector
              destination={commute.destination}
              presets={commute.presets}
              onSelect={commute.setDestination}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-card">
        <p className="text-sm font-medium text-center">{matchCount} matching apartments</p>
      </div>
    </div>
  );
}
