import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import type { Apartment } from '@/data/apartments';

interface ScoreRadarChartProps {
  apartment: Apartment;
  size?: number;
}

export function ScoreRadarChart({ apartment, size = 180 }: ScoreRadarChartProps) {
  const data = [
    { subject: 'Safety', value: apartment.safetyScore, fullMark: 10 },
    { subject: 'Walk', value: apartment.walkabilityScore, fullMark: 10 },
    { subject: 'Transit', value: apartment.transitScore, fullMark: 10 },
    { subject: 'Entertain', value: apartment.entertainmentScore, fullMark: 10 },
  ];

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
