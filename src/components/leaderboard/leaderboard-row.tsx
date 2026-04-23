import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ProviderGlyph, ModelGlyph } from '@/components/provider/glyph';
import { AnomalyBadge, ProviderBadge, ThinkingBadge } from '@/components/provider/provider-badge';

type Mode = 'model' | 'provider';

interface LeaderboardRowProps {
  rank: number;
  mode: Mode;
  provider: string;
  model?: string;
  displayName?: string;
  modelCount?: number;
  primary: ReactNode;
  secondary?: ReactNode;
  hasThinking?: boolean;
  hasAnomaly?: boolean;
  rankAccent?: 'gold' | 'silver' | 'bronze' | 'default';
}

const ACCENT_CLASS: Record<NonNullable<LeaderboardRowProps['rankAccent']>, string> = {
  gold: 'bg-gradient-to-br from-amber-400/90 to-orange-400/90 text-white shadow-[0_8px_20px_-8px_rgba(251,146,60,0.5)]',
  silver: 'bg-gradient-to-br from-slate-300/90 to-slate-200/90 text-slate-900 shadow-[0_8px_20px_-8px_rgba(148,163,184,0.5)]',
  bronze: 'bg-gradient-to-br from-orange-600/80 to-amber-700/80 text-white shadow-[0_8px_20px_-8px_rgba(217,119,6,0.5)]',
  default: 'bg-secondary text-foreground',
};

function pickAccent(rank: number): NonNullable<LeaderboardRowProps['rankAccent']> {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'default';
}

export function LeaderboardRow({
  rank,
  mode,
  provider,
  model,
  displayName,
  modelCount,
  primary,
  secondary,
  hasThinking,
  hasAnomaly,
  rankAccent,
}: LeaderboardRowProps) {
  const accent = rankAccent ?? pickAccent(rank);
  const GlyphIcon = mode === 'provider' ? ProviderGlyph : ModelGlyph;
  const title = mode === 'provider' ? provider : (displayName || model || provider);

  return (
    <article className="group flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 px-3 py-2.5 transition-colors hover:border-border hover:bg-card">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold num-tabular',
          ACCENT_CLASS[accent],
        )}
      >
        {rank}
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background/80">
        <GlyphIcon provider={provider} model={model || ''} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-foreground" title={title}>
            {title}
          </span>
          {hasThinking ? <ThinkingBadge /> : null}
          {hasAnomaly ? <AnomalyBadge providerMode={mode === 'provider'} /> : null}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          {mode === 'provider' ? (
            <span>覆盖 {modelCount ?? 0} 个模型</span>
          ) : (
            <ProviderBadge provider={provider} model={model || ''} />
          )}
        </div>
      </div>
      <div className="flex flex-col items-end text-right">
        <div className="num-tabular text-sm font-semibold text-foreground">{primary}</div>
        {secondary ? <div className="mt-0.5 num-tabular text-[11px] text-muted-foreground">{secondary}</div> : null}
      </div>
    </article>
  );
}
