import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from '@/lib/palette';
import { PerformanceTooltip } from './tooltips';
import { CollapsibleLegend } from './collapsible-legend';
import { clampTtftValue, getMetricAxisProps } from '@/lib/metric-axis';
import { normalizeModelDisplay } from '@/lib/model-normalize';
import type { HistoryPoint, LatestResult } from '@/lib/types';

type Metric = 'tps' | 'ttft';

interface HistoryLineChartProps {
  historyData: HistoryPoint[];
  latestData: LatestResult[];
  metric: Metric;
  emptyStateText: string;
  height?: number;
  viewMode?: 'provider' | 'model';
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export function HistoryLineChart({ historyData, latestData, metric, emptyStateText, height, viewMode = 'provider' }: HistoryLineChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const effectiveHeight = height ?? (isMobile ? 260 : 380);

  const { series, data } = useMemo(() => {
    const buckets = new Map<string, Record<string, number | string>>();
    historyData.forEach((item) => {
      const existing = buckets.get(item.timePoint) ?? { timePoint: item.timePoint };
      const seriesKey = `${item.provider}__${item.model}`;
      if (metric === 'ttft') {
        existing[seriesKey] = clampTtftValue(item.ttft);
        existing[`${seriesKey}_original`] = item.ttft;
      } else {
        existing[seriesKey] = item.medianTps || item.avgTps;
      }
      buckets.set(item.timePoint, existing);
    });
    const seriesKeys = Array.from(new Set(historyData.map((item) => `${item.provider}__${item.model}`)));
    const seriesDefs = seriesKeys.map((key, index) => {
      const matched = historyData.find((item) => `${item.provider}__${item.model}` === key);
      const latest = latestData.find((item) => item.model === matched?.model && item.provider === matched?.provider);
      const modelLabel = normalizeModelDisplay(matched?.model || '', matched?.modelDisplay || latest?.modelDisplay || matched?.model || '');
      const label = viewMode === 'model' ? modelLabel : matched?.provider || '';
      return {
        key,
        label,
        color: palette[index % palette.length],
        provider: matched?.provider || '',
        model: matched?.model || '',
      };
    });
    return { series: seriesDefs, data: Array.from(buckets.values()) };
  }, [historyData, latestData, metric]);

  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border/60 text-sm text-muted-foreground">
        {emptyStateText}
      </div>
    );
  }

  const metricAxis = getMetricAxisProps(metric);

  return (
    <div>
      <div style={{ width: '100%', height: effectiveHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: isMobile ? 8 : 16, left: isMobile ? 0 : 8, bottom: 6 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="timePoint"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 11 }}
              minTickGap={isMobile ? 40 : 24}
            />
            <YAxis {...metricAxis} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 11 }} width={isMobile ? 32 : 44} />
            <Tooltip content={<PerformanceTooltip metric={metric} />} />
            {series.map((s) => {
              const isActive = activeKey === s.key;
              const isHidden = Boolean(activeKey && !isActive);
              return (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={isActive ? 2.8 : 2}
                  strokeOpacity={isHidden ? 0.15 : 1}
                  dot={false}
                  activeDot={isHidden ? false : { r: 4 }}
                  connectNulls
                  isAnimationActive={false}
                  hide={isHidden}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <CollapsibleLegend
        series={series}
        activeKey={activeKey}
        onToggle={(key) => setActiveKey((prev) => (prev === key ? null : key))}
      />
    </div>
  );
}
