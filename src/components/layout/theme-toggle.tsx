import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme, type ThemeMode } from '@/hooks/use-theme';
import { cn } from '@/lib/cn';

const MODES: Array<{ key: ThemeMode; icon: typeof Sun; label: string }> = [
  { key: 'light', icon: Sun, label: '浅色' },
  { key: 'dark', icon: Moon, label: '深色' },
  { key: 'system', icon: Monitor, label: '跟随' },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/60 p-0.5">
        {MODES.map(({ key, icon: Icon, label }) => (
          <Button
            key={key}
            type="button"
            size="icon"
            variant={mode === key ? 'secondary' : 'ghost'}
            className={cn('h-7 w-7 text-muted-foreground', mode === key && 'text-foreground')}
            aria-label={label}
            onClick={() => setMode(key)}
          >
            <Icon className="h-3.5 w-3.5" />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {MODES.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setMode(key)}
          className={cn(
            'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors',
            mode === key && 'bg-secondary text-foreground',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
