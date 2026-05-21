import type { Apartment } from '@/data/apartments';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, X } from 'lucide-react';

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-400';
  if (score >= 7) return 'text-lime-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 5) return 'text-orange-400';
  return 'text-red-400';
};

const getBarWidth = (score: number) => `${(score / 10) * 100}%`;

const getBarColor = (score: number) => {
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
};

interface CompareViewProps {
  apartments: Apartment[];
  onRemove: (name: string) => void;
  onClose: () => void;
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: getBarWidth(score), backgroundColor: getBarColor(score) }}
        />
      </div>
      <span className={`text-xs font-bold w-5 text-right ${getScoreColor(score)}`}>{score}</span>
    </div>
  );
}

export function CompareView({ apartments, onRemove, onClose }: CompareViewProps) {
  if (apartments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <p className="text-lg font-medium mb-2">No apartments to compare</p>
        <p className="text-sm">Favorite 2-3 apartments, then use the compare button to see them side-by-side.</p>
      </div>
    );
  }

  const rows: { label: string; render: (apt: Apartment) => React.ReactNode }[] = [
    { label: 'Rent', render: (apt) => <span className="font-semibold text-primary">${apt.rentMin}{apt.rentMax ? `–$${apt.rentMax}` : '+'}</span> },
    { label: 'Neighborhood', render: (apt) => <span className="text-sm">{apt.neighborhood}</span> },
    { label: 'Address', render: (apt) => <span className="text-xs text-muted-foreground">{apt.address}</span> },
    { label: 'Units', render: (apt) => <span className="text-sm">{apt.unitTypes}</span> },
    { label: 'W/D', render: (apt) => <span className="text-sm">{apt.washerDryer}</span> },
    { label: 'Safety', render: (apt) => <ScoreBar score={apt.safetyScore} /> },
    { label: 'Walkability', render: (apt) => <ScoreBar score={apt.walkabilityScore} /> },
    { label: 'Transit', render: (apt) => <ScoreBar score={apt.transitScore} /> },
    { label: 'Entertainment', render: (apt) => <ScoreBar score={apt.entertainmentScore} /> },
    { label: 'Overall', render: (apt) => <span className={`text-lg font-bold ${getScoreColor(apt.overallScore)}`}>{apt.overallScore}</span> },
    { label: 'Website', render: (apt) => (
      <a href={apt.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
        Visit <ArrowUpRight className="w-3 h-3" />
      </a>
    )},
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <span className="font-semibold text-sm">Comparing {apartments.length} apartments</span>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 text-xs">
          <X className="w-3.5 h-3.5 mr-1" /> Close
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-4 text-left text-xs text-muted-foreground w-24"></th>
                {apartments.map((apt) => (
                  <th key={apt.name} className="pb-3 px-3 text-left min-w-[160px]">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-sm leading-tight">{apt.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(apt.name)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border/30">
                  <td className="py-3 pr-4 text-xs text-muted-foreground font-medium uppercase tracking-wider align-middle">
                    {row.label}
                  </td>
                  {apartments.map((apt) => (
                    <td key={apt.name} className="py-3 px-3 align-middle">
                      {row.render(apt)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-4 text-xs text-muted-foreground font-medium uppercase tracking-wider align-top">
                  Notes
                </td>
                {apartments.map((apt) => (
                  <td key={apt.name} className="py-3 px-3 align-top">
                    <p className="text-xs text-muted-foreground leading-relaxed">{apt.notes}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
