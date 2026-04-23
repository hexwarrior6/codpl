import { useEffect, useMemo, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { buildPerformanceDataset } from '@/lib/performance-dataset';
import { CollapsibleLegend } from './collapsible-legend';
import { PerformanceTooltip } from './tooltips';
import { formatPerformanceAxisTick } from '@/lib/format';
import { getMetricAxisProps } from '@/lib/metric-axis';
import type { PerformancePoint } from '@/lib/types';

type Metric = 'tps' | 'ttft';

interface PerformanceAreaChartProps {
  points: PerformancePoint[];
  metric: Metric;
  emptyStateText: string;
  height?: number;
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

export function PerformanceAreaChart({ points, metric, emptyStateText, height }: PerformanceAreaChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const effectiveHeight = height ?? (isMobile ? 280 : 420);
  const dataset = useMemo(() => buildPerformanceDataset(points, metric), [points, metric]);

  if (!dataset.data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center rounded-lg border border-dashed border-border/60 text-sm text-muted-foreground">
        {emptyStateText}
      </div>
    );
  }

  const perfSeries = dataset.series.map((s) => ({
    key: s.dataKey,
    label: s.label,
    color: s.color,
    provider: s.label.split(' / ')[0] || '',
    model: '',
  }));

  const metricAxis = getMetricAxisProps(metric);

  return (
    <div>
      <div style={{ width: '100%', height: effectiveHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataset.data} margin={{ top: 8, right: isMobile ? 8 : 18, left: isMobile ? 0 : 6, bottom: 6 }}>
            <defs>
              {dataset.series.map((s) => (
                <linearGradient id={s.fillId} key={s.fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.32} />
                  <stop offset="72%" stopColor={s.color} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} opacity={0.6} />
            <XAxis
              dataKey="timestampUnix"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatPerformanceAxisTick}
              minTickGap={isMobile ? 40 : 24}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 11 }}
            />
            <YAxis {...metricAxis} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 11 }} width={isMobile ? 32 : 44} />
            <Tooltip content={<PerformanceTooltip metric={metric} />} />
            {dataset.series.map((s) => {
              if (activeKey && activeKey !== s.dataKey) return null;
              return (
                <Area
                  key={`area-${s.dataKey}`}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.label}
                  stroke="none"
                  fill={`url(#${s.fillId})`}
                  tooltipType="none"
                  connectNulls
                  isAnimationActive={false}
                />
              );
            })}
            {dataset.series.map((s) => {
              const isActive = activeKey === s.dataKey;
              const isHidden = Boolean(activeKey && !isActive);
              return (
                <Line
                  key={`line-${s.dataKey}`}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={isActive ? 2.8 : 2.2}
                  strokeOpacity={isHidden ? 0.12 : 1}
                  dot={false}
                  activeDot={isHidden ? false : { r: 4 }}
                  connectNulls
                  isAnimationActive={false}
                  hide={isHidden}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <CollapsibleLegend
        series={perfSeries}
        activeKey={activeKey}
        onToggle={(key) => setActiveKey((prev) => (prev === key ? null : key))}
      />
    </div>
  );
}
