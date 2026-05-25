import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import MapPage from '@/components/MapPage';

const queryClient = new QueryClient();

export default function ApartmentFinder() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MapPage />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
