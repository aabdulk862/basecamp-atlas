import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { apartments, neighborhoods, washerDryerOptions, type Apartment } from '../data/apartments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, ArrowUpRight, Star } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const getMarkerColor = (score: number) => {
  if (score >= 8) return '#22c55e'; // Green
  if (score >= 7) return '#84cc16'; // Yellow-Green
  if (score >= 6) return '#eab308'; // Yellow
  if (score >= 5) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

const createCustomIcon = (score: number) => {
  const color = getMarkerColor(score);
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

type SortOption = 'Overall Score' | 'Rent Low-High' | 'Rent High-Low' | 'Safety' | 'Walkability' | 'Transit' | 'Entertainment';

export default function MapPage() {
  const [rentRange, setRentRange] = useState<[number, number]>([850, 1900]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [washerDryer, setWasherDryer] = useState<string>('All');
  const [safetyScore, setSafetyScore] = useState<[number]>([1]);
  const [walkabilityScore, setWalkabilityScore] = useState<[number]>([1]);
  const [transitScore, setTransitScore] = useState<[number]>([1]);
  const [entertainmentScore, setEntertainmentScore] = useState<[number]>([1]);
  const [sortBy, setSortBy] = useState<SortOption>('Overall Score');
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  const handleNeighborhoodToggle = (n: string) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const handleReset = () => {
    setRentRange([850, 1900]);
    setSelectedNeighborhoods([]);
    setWasherDryer('All');
    setSafetyScore([1]);
    setWalkabilityScore([1]);
    setTransitScore([1]);
    setEntertainmentScore([1]);
    setSortBy('Overall Score');
  };

  const filteredApartments = useMemo(() => {
    let result = apartments.filter((apt) => {
      if (apt.rentMin > rentRange[1] || (apt.rentMax && apt.rentMax < rentRange[0])) return false;
      if (selectedNeighborhoods.length > 0 && !selectedNeighborhoods.includes(apt.neighborhood)) return false;
      if (washerDryer !== 'All' && apt.washerDryer !== washerDryer) return false;
      if (apt.safetyScore < safetyScore[0]) return false;
      if (apt.walkabilityScore < walkabilityScore[0]) return false;
      if (apt.transitScore < transitScore[0]) return false;
      if (apt.entertainmentScore < entertainmentScore[0]) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Overall Score':
          return b.overallScore - a.overallScore;
        case 'Rent Low-High':
          return a.rentMin - b.rentMin;
        case 'Rent High-Low':
          return b.rentMin - a.rentMin;
        case 'Safety':
          return b.safetyScore - a.safetyScore;
        case 'Walkability':
          return b.walkabilityScore - a.walkabilityScore;
        case 'Transit':
          return b.transitScore - a.transitScore;
        case 'Entertainment':
          return b.entertainmentScore - a.entertainmentScore;
        default:
          return 0;
      }
    });

    return result;
  }, [
    rentRange,
    selectedNeighborhoods,
    washerDryer,
    safetyScore,
    walkabilityScore,
    transitScore,
    entertainmentScore,
    sortBy,
  ]);

  const activeFilterCount =
    (rentRange[0] > 850 || rentRange[1] < 1900 ? 1 : 0) +
    (selectedNeighborhoods.length > 0 ? 1 : 0) +
    (washerDryer !== 'All' ? 1 : 0) +
    (safetyScore[0] > 1 ? 1 : 0) +
    (walkabilityScore[0] > 1 ? 1 : 0) +
    (transitScore[0] > 1 ? 1 : 0) +
    (entertainmentScore[0] > 1 ? 1 : 0);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background text-foreground flex">
      {/* Sidebar Filter Panel */}
      <div className="w-full md:w-96 shrink-0 h-full border-r border-border bg-card flex flex-col z-10 shadow-2xl">
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
                  <span className="text-xs font-medium">{safetyScore[0]}+</span>
                </div>
                <Slider min={1} max={10} step={1} value={safetyScore} onValueChange={(val) => setSafetyScore(val as [number])} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Walkability</span>
                  <span className="text-xs font-medium">{walkabilityScore[0]}+</span>
                </div>
                <Slider min={1} max={10} step={1} value={walkabilityScore} onValueChange={(val) => setWalkabilityScore(val as [number])} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Transit</span>
                  <span className="text-xs font-medium">{transitScore[0]}+</span>
                </div>
                <Slider min={1} max={10} step={1} value={transitScore} onValueChange={(val) => setTransitScore(val as [number])} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Entertainment</span>
                  <span className="text-xs font-medium">{entertainmentScore[0]}+</span>
                </div>
                <Slider min={1} max={10} step={1} value={entertainmentScore} onValueChange={(val) => setEntertainmentScore(val as [number])} />
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
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border bg-card">
          <p className="text-sm font-medium text-center">{filteredApartments.length} matching apartments</p>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative h-full">
        <MapContainer
          center={[35.227, -80.843]}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredApartments.map((apt) => (
            <Marker
              key={apt.name}
              position={[apt.lat, apt.lng]}
              icon={createCustomIcon(apt.overallScore)}
              eventHandlers={{
                click: () => setSelectedApartment(apt),
              }}
            >
              {/* Optional: Add a simple popup for hover or immediate basic info, but requirements specify a drill-down panel/popup on click */}
            </Marker>
          ))}
        </MapContainer>

        {/* Selected Apartment Overlay */}
        {selectedApartment && (
          <div className="absolute top-4 right-4 z-[1000] w-80 shadow-2xl rounded-xl">
            <Card className="bg-card border-border shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)]">
              <CardHeader className="bg-muted/30 pb-4 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedApartment(null)}
                >
                  <span className="text-lg leading-none">&times;</span>
                </Button>
                <div className="flex justify-between items-start pr-6">
                  <div>
                    <CardTitle className="text-xl font-bold leading-tight">{selectedApartment.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApartment.address}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-bold px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {selectedApartment.overallScore}
                  </Badge>
                </div>
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent className="p-5 space-y-5">
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">Neighborhood</p>
                      <p className="font-medium">{selectedApartment.neighborhood}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">Rent Range</p>
                      <p className="font-medium">${selectedApartment.rentMin} {selectedApartment.rentMax ? `- $${selectedApartment.rentMax}` : '+'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">Unit Types</p>
                      <p className="font-medium">{selectedApartment.unitTypes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">Laundry</p>
                      <p className="font-medium">{selectedApartment.washerDryer}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border pb-1">Scores</p>
                    {[
                      { label: 'Safety', score: selectedApartment.safetyScore },
                      { label: 'Walkability', score: selectedApartment.walkabilityScore },
                      { label: 'Transit', score: selectedApartment.transitScore },
                      { label: 'Entertainment', score: selectedApartment.entertainmentScore },
                    ].map(item => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.score}/10</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(item.score / 10) * 100}%`,
                              backgroundColor: getMarkerColor(item.score)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold border-b border-border pb-1">Notes & Area</p>
                    <p className="text-sm leading-relaxed">{selectedApartment.notes}</p>
                    <div className="text-sm bg-muted/50 p-3 rounded-md border border-border/50">
                      <span className="font-semibold block mb-1">Nearby Attractions:</span>
                      <span className="text-muted-foreground">{selectedApartment.nearbyAttractions}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <a href={selectedApartment.url} target="_blank" rel="noopener noreferrer">
                      View Listing <ArrowUpRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}