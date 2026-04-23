import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { ProviderGlyph } from '@/components/provider/glyph';

interface LegendSeries {
  key: string;
  label: string;
  color: string;
  provider?: string;
  model?: string;
}

interface CollapsibleLegendProps {
  series: LegendSeries[];
  activeKey: string | null;
  onToggle: (key: string) => void;
  collapsedCount?: number;
}

export function CollapsibleLegend({ series, activeKey, onToggle, collapsedCount = 6 }: CollapsibleLegendProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? series : series.slice(0, collapsedCount);
  const hasMore = series.length > collapsedCount;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {visible.map((s) => {
          const isActive = activeKey === s.key;
          const isDimmed = Boolean(activeKey && !isActive);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onToggle(s.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition-all',
                isActive
                  ? 'border-primary/60 bg-primary/10 text-foreground shadow-sm'
                  : isDimmed
                    ? 'border-border/40 bg-background/40 text-muted-foreground opacity-60 hover:opacity-100'
                    : 'border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              <ProviderGlyph provider={s.provider || ''} model={s.model || ''} size={14} />
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="max-w-[180px] truncate">{s.label}</span>
            </button>
          );
        })}
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? (
            <>
              收起
              <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              展开全部 ({series.length})
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
