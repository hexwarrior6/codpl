export function formatNumber(value: number | null | undefined, digits = 1): string {
  if (!Number.isFinite(value as number)) {
    return '--';
  }
  return (value as number).toFixed(digits);
}

export function formatPercent(value: number | null | undefined): string {
  if (!Number.isFinite(value as number)) {
    return '--';
  }
  const v = value as number;
  return `${(v * 100).toFixed(v >= 0.995 ? 0 : 1)}%`;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!Number.isFinite(seconds as number)) {
    return '--';
  }
  const s = seconds as number;
  if (s < 1) {
    return `${(s * 1000).toFixed(0)} ms`;
  }
  if (s < 60) {
    return `${s.toFixed(s < 10 ? 1 : 0)} s`;
  }
  const mins = Math.floor(s / 60);
  const rem = s - mins * 60;
  return `${mins}m ${rem.toFixed(0)}s`;
}

export function formatTimestamp(value: Date | string | null | undefined): string {
  if (!value) return '--';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(value: string | Date | null | undefined): string {
  if (!value) return '--';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diff = Date.now() - date.getTime();
  const absDiff = Math.abs(diff);
  const minutes = Math.round(absDiff / 60000);
  const hours = Math.round(absDiff / 3600000);
  const days = Math.round(absDiff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return formatTimestamp(date);
}

export function formatPerformanceAxisTick(value: number): string {
  if (!Number.isFinite(value)) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
  }).format(date);
}

export function formatCommentTime(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
