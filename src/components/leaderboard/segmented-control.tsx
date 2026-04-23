import { cn } from '@/lib/cn';

interface SegmentedControlOption<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  options: Array<SegmentedControlOption<T>>;
  value: T;
  onChange: (next: T) => void;
  ariaLabel?: string;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
}: SegmentedControlProps<T>) {
  const isSm = size === 'sm';
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex rounded-lg border border-border/60 bg-background/60 p-0.5', isSm && 'p-[2px]')}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center justify-center rounded-md font-medium transition-colors',
              isSm ? 'h-6 px-2 text-[11px]' : 'h-7 px-3 text-xs',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
