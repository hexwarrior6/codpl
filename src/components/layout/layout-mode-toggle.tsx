import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayoutMode } from '@/hooks/use-layout-mode';
import { cn } from '@/lib/cn';

export function LayoutModeToggle({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { mode, toggle } = useLayoutMode();
  const isWide = mode === 'wide';
  const label = isWide ? '切换到标准宽度' : '切换到宽屏模式';

  if (compact) {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label={label}
        title={label}
        onClick={toggle}
        className={cn(
          'h-7 w-7 rounded-md border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
          isWide && 'bg-primary/10 text-primary',
          className,
        )}
      >
        {isWide ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isWide}
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground',
        isWide && 'border-primary/40 bg-primary/10 text-primary',
        className,
      )}
    >
      {isWide ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      {isWide ? '标准' : '宽屏'}
    </button>
  );
}
