import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import MapPage from '@/components/MapPage';
import type { CityConfig } from '@/components/map/LiveMapAdapter';

const queryClient = new QueryClient();

interface ApartmentFinderProps {
  cityConfig?: CityConfig;
  cities?: CityConfig[];
}

export default function ApartmentFinder({ cityConfig, cities }: ApartmentFinderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MapPage cityConfig={cityConfig} cities={cities} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
