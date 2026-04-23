import { ShieldCheck, Sparkles, Star, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type TrustLevelKey = 0 | 1 | 2 | 3 | 4;

interface TrustStyle {
  label: string;
  shortLabel: string;
  gradient: string;
  text: string;
  ring: string;
  soft: string;
  accent: string;
  icon: ReactNode;
}

const UNKNOWN_STYLE: TrustStyle = {
  label: '未验证',
  shortLabel: 'LV?',
  gradient: 'from-slate-400 to-slate-500',
  text: 'text-slate-100',
  ring: 'ring-slate-400/40',
  soft: 'bg-slate-500/10 text-slate-500 dark:text-slate-300',
  accent: 'rgba(148, 163, 184, 0.7)',
  icon: <UserRound className="h-3 w-3" aria-hidden="true" />,
};

const STYLES: Record<TrustLevelKey, TrustStyle> = {
  0: {
    label: '新用户',
    shortLabel: 'LV0',
    gradient: 'from-slate-400 to-slate-500',
    text: 'text-slate-50',
    ring: 'ring-slate-400/50',
    soft: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
    accent: 'rgba(100, 116, 139, 0.65)',
    icon: <UserRound className="h-3 w-3" aria-hidden="true" />,
  },
  1: {
    label: '基本用户',
    shortLabel: 'LV1',
    gradient: 'from-sky-400 to-blue-500',
    text: 'text-blue-50',
    ring: 'ring-sky-400/50',
    soft: 'bg-sky-500/12 text-sky-600 dark:text-sky-300',
    accent: 'rgba(56, 189, 248, 0.75)',
    icon: <UserRound className="h-3 w-3" aria-hidden="true" />,
  },
  2: {
    label: '成员',
    shortLabel: 'LV2',
    gradient: 'from-emerald-400 to-teal-500',
    text: 'text-emerald-50',
    ring: 'ring-emerald-400/50',
    soft: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
    accent: 'rgba(52, 211, 153, 0.75)',
    icon: <ShieldCheck className="h-3 w-3" aria-hidden="true" />,
  },
  3: {
    label: '活跃用户',
    shortLabel: 'LV3',
    gradient: 'from-violet-500 to-purple-600',
    text: 'text-violet-50',
    ring: 'ring-violet-400/50',
    soft: 'bg-violet-500/12 text-violet-600 dark:text-violet-300',
    accent: 'rgba(167, 139, 250, 0.75)',
    icon: <Star className="h-3 w-3" aria-hidden="true" />,
  },
  4: {
    label: '领导者',
    shortLabel: 'LV4',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    text: 'text-amber-50',
    ring: 'ring-amber-400/60',
    soft: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    accent: 'rgba(251, 146, 60, 0.8)',
    icon: <Sparkles className="h-3 w-3" aria-hidden="true" />,
  },
};

export function resolveTrustStyle(level: number | undefined | null): TrustStyle {
  if (typeof level !== 'number' || Number.isNaN(level)) return UNKNOWN_STYLE;
  const key = Math.max(0, Math.min(4, Math.floor(level))) as TrustLevelKey;
  return STYLES[key] ?? UNKNOWN_STYLE;
}

interface TrustBadgeProps {
  level: number | undefined | null;
  variant?: 'chip' | 'pill' | 'dot';
  className?: string;
  showLabel?: boolean;
}

export function TrustBadge({ level, variant = 'chip', className, showLabel = true }: TrustBadgeProps) {
  const style = resolveTrustStyle(level);

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-semibold shadow-sm',
          style.gradient,
          style.text,
          className,
        )}
        title={`${style.shortLabel} · ${style.label}`}
      >
        {typeof level === 'number' ? level : '?'}
      </span>
    );
  }

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
          style.soft,
          className,
        )}
      >
        {style.icon}
        <span className="tracking-wide">{style.shortLabel}</span>
        {showLabel ? <span className="opacity-80">· {style.label}</span> : null}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-gradient-to-br px-1.5 py-0.5 text-[10px] font-semibold shadow-[0_2px_6px_-3px_rgba(0,0,0,0.35)]',
        style.gradient,
        style.text,
        className,
      )}
    >
      {style.icon}
      <span className="tracking-wide">{style.shortLabel}</span>
      {showLabel ? <span className="opacity-90">{style.label}</span> : null}
    </span>
  );
}

export function TrustAvatarRing({ level, className }: { level: number | undefined | null; className?: string }) {
  const style = resolveTrustStyle(level);
  return <span className={cn('pointer-events-none absolute inset-0 rounded-full ring-2', style.ring, className)} aria-hidden="true" />;
}
