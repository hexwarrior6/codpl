import { Info } from 'lucide-react';
import { METRIC_HELP_TEXT } from '@/lib/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function MetricInfoHint({ metric, label }: { metric: keyof typeof METRIC_HELP_TEXT; label?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/60 bg-background/60 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            aria-label={label || `${metric.toUpperCase()} 指标说明`}
          >
            <Info className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs leading-relaxed">
          {METRIC_HELP_TEXT[metric]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
