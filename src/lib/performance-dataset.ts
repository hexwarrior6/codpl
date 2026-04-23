import { palette } from './palette';
import { clampTtftValue } from './metric-axis';
import type { PerformancePoint } from './types';

export interface PerformanceSeries {
  originalKey: string;
  dataKey: string;
  label: string;
  color: string;
  fillId: string;
}

export interface PerformanceDataPoint {
  timestampUnix: number;
  timestampLabel: string;
  [seriesKey: string]: number | string;
}

export interface PerformanceDataset {
  series: PerformanceSeries[];
  data: PerformanceDataPoint[];
}

/**
 * 把后端按小时桶聚合的 PerformancePoint[] 转成 Recharts 所需的宽表。
 * 与 [frontend/src/App.jsx:1007-1050] 保持一致：ttft 模式下保留原始值在 `${key}_original`。
 */
export function buildPerformanceDataset(
  points: PerformancePoint[],
  metric: 'tps' | 'ttft',
): PerformanceDataset {
  const seriesMap = new Map<string, PerformanceSeries>();
  const series: PerformanceSeries[] = [];

  points.forEach((item) => {
    if (!seriesMap.has(item.seriesKey)) {
      const def: PerformanceSeries = {
        originalKey: item.seriesKey,
        dataKey: `series_${series.length}`,
        label: item.seriesLabel,
        color: palette[series.length % palette.length],
        fillId: `performance-fill-${series.length}`,
      };
      seriesMap.set(item.seriesKey, def);
      series.push(def);
    }
  });

  const buckets = new Map<number, PerformanceDataPoint>();
  points.forEach((item) => {
    const def = seriesMap.get(item.seriesKey)!;
    const bucketKey = Number.isFinite(item.timestampUnix) ? item.timestampUnix : 0;
    const existing: PerformanceDataPoint = buckets.get(bucketKey) ?? {
      timestampUnix: bucketKey,
      timestampLabel: item.timestamp,
    };
    if (metric === 'ttft') {
      existing[def.dataKey] = clampTtftValue(item.ttft);
      existing[`${def.dataKey}_original`] = item.ttft ?? 0;
    } else {
      existing[def.dataKey] = item.medianTps || item.tokensPerSec || 0;
    }
    buckets.set(bucketKey, existing);
  });

  const data = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([, value]) => value);

  return { series, data };
}
