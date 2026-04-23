import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({ title, subtitle, action, children, className, contentClassName }: SectionCardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border/60 bg-card/80 shadow-soft backdrop-blur-xl transition-colors',
        className,
      )}
    >
      <header className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center gap-2 text-base font-semibold leading-tight tracking-tight text-foreground">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action ? <div className="w-full sm:w-auto sm:shrink-0">{action}</div> : null}
      </header>
      <div className={cn('px-4 pb-4 sm:px-5 sm:pb-5', contentClassName)}>{children}</div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  highlight?: ReactNode;
  corner?: ReactNode;
  aside?: ReactNode;
  className?: string;
  contentKey?: string;
}

export function StatCard({ label, value, detail, highlight, corner, aside, className, contentKey }: StatCardProps) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-border/60 bg-card/80 p-4 shadow-soft backdrop-blur-xl sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {corner}
      </div>
      <div key={contentKey} className="flex flex-1 flex-col justify-center gap-2 animate-fade-in">
        <div className="text-xl font-semibold tracking-tight text-foreground num-tabular sm:text-2xl lg:text-3xl">{value}</div>
        {highlight ? <div>{highlight}</div> : null}
        {detail ? <div className="text-xs text-muted-foreground">{detail}</div> : null}
      </div>
      {aside ? <div className="pt-2">{aside}</div> : null}
    </article>
  );
}

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-[180px] items-center justify-center rounded-lg border border-dashed border-border/60 text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}
