import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { FeedbackType } from '@/hooks/use-score-feedback';

interface ScoreFeedbackProps {
  apartmentName: string;
  category: string;
  currentFeedback: FeedbackType;
  onFeedback: (apartmentName: string, category: string, value: FeedbackType) => void;
}

export function ScoreFeedback({ apartmentName, category, currentFeedback, onFeedback }: ScoreFeedbackProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${currentFeedback === 'up' ? 'text-green-400' : 'text-muted-foreground/50 hover:text-green-400'}`}
        onClick={(e) => {
          e.stopPropagation();
          onFeedback(apartmentName, category, 'up');
        }}
        aria-label={`Score feels right for ${category}`}
      >
        <ThumbsUp className="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${currentFeedback === 'down' ? 'text-red-400' : 'text-muted-foreground/50 hover:text-red-400'}`}
        onClick={(e) => {
          e.stopPropagation();
          onFeedback(apartmentName, category, 'down');
        }}
        aria-label={`Score feels wrong for ${category}`}
      >
        <ThumbsDown className="w-3 h-3" />
      </Button>
    </div>
  );
}
