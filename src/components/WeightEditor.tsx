import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Sparkles } from 'lucide-react';
import type { ScoreWeights } from '@/hooks/use-score-weights';

interface WeightEditorProps {
  weights: ScoreWeights;
  isCustom: boolean;
  onWeightsChange: (weights: ScoreWeights) => void;
  onReset: () => void;
}

const LABELS: { key: keyof ScoreWeights; label: string; color: string }[] = [
  { key: 'safety', label: 'Safety', color: 'text-blue-400' },
  { key: 'walkability', label: 'Walkability', color: 'text-green-400' },
  { key: 'transit', label: 'Transit', color: 'text-purple-400' },
  { key: 'entertainment', label: 'Entertainment', color: 'text-amber-400' },
];

export function WeightEditor({ weights, isCustom, onWeightsChange, onReset }: WeightEditorProps) {
  const total = weights.safety + weights.walkability + weights.transit + weights.entertainment;

  const handleChange = (key: keyof ScoreWeights, value: number) => {
    onWeightsChange({ ...weights, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score Weights</span>
          {isCustom && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary">Custom</Badge>
          )}
        </div>
        {isCustom && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-6 px-2 text-xs text-muted-foreground">
            <RotateCcw className="w-3 h-3 mr-1" />
            Default
          </Button>
        )}
      </div>

      {LABELS.map(({ key, label, color }) => {
        const pct = total > 0 ? Math.round((weights[key] / total) * 100) : 0;
        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium ${color}`}>{label}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{pct}%</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={1}
              value={[weights[key] * 10]}
              onValueChange={(val) => handleChange(key, val[0] / 10)}
            />
          </div>
        );
      })}

      <p className="text-[10px] text-muted-foreground text-center pt-1">
        Drag to prioritize what matters to you. Scores recalculate live.
      </p>
    </div>
  );
}
