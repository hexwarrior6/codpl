import { TTFT_CHART_MAX } from './constants';

export function clampTtftValue(value: number | null | undefined): number {
  if (!Number.isFinite(value as number) || (value as number) <= 0) return 0;
  return Math.min(value as number, TTFT_CHART_MAX);
}

export function formatMetricValue(metric: 'tps' | 'ttft', value: number | null | undefined): string {
  if (!Number.isFinite(value as number)) return '--';
  if (metric === 'ttft') {
    return `${Math.round(value as number)} ms`;
  }
  return `${(value as number).toFixed(1)} tok/s`;
}

export function getMetricAxisProps(metric: 'tps' | 'ttft') {
  if (metric === 'ttft') {
    return {
      domain: [0, TTFT_CHART_MAX] as [number, number],
      tickFormatter: (v: number) => `${v}`,
      allowDataOverflow: true,
    };
  }
  return {
    domain: [0, 'dataMax + 10'] as [number, string],
    tickFormatter: (v: number) => v.toFixed(0),
    allowDataOverflow: false,
  };
}
