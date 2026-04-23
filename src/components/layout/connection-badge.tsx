import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/format';

export function ConnectionBadge({ className }: { className?: string }) {
  const { lastUpdatedAt } = useBenchmarkData();
  const label = lastUpdatedAt ? `静态快照 · ${formatRelativeTime(lastUpdatedAt)}` : '等待生成静态快照';
  const dotColor = lastUpdatedAt ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shadow-[0_0_0_4px_currentColor]', dotColor)} />
      <span>{label}</span>
    </div>
  );
}
