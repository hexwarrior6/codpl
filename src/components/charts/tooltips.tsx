import type { TooltipProps } from 'recharts';
import { formatMetricValue } from '@/lib/metric-axis';
import { formatNumber } from '@/lib/format';
import { TTFT_CHART_MAX } from '@/lib/constants';

type Metric = 'tps' | 'ttft';

interface ModelTooltipProps extends TooltipProps<number, string> {
  metric?: Metric;
}

export function ModelChartTooltip({ active, payload, metric = 'tps' }: ModelTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as Record<string, unknown>;
  const value = metric === 'ttft' ? Number(data.avgTtft) || 0 : Number(data.medianTps) || Number(data.avgTps) || 0;

  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="font-medium text-foreground">{String(data.normalizedModelDisplay || data.model || '--')}</div>
      <div className="mt-0.5 text-muted-foreground">{String(data.provider || '')}</div>
      <div className="mt-1.5 text-base font-semibold text-foreground">{formatMetricValue(metric, value)}</div>
    </div>
  );
}

interface ProviderTooltipProps extends TooltipProps<number, string> {
  metric?: Metric;
}

export function ProviderChartTooltip({ active, payload, metric = 'tps' }: ProviderTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as Record<string, unknown>;
  const value = metric === 'ttft' ? Number(data.averageTtft) || 0 : Number(data.averageMedianTps) || Number(data.averageTps) || 0;

  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="font-medium text-foreground">{String(data.provider || '--')}</div>
      <div className="mt-0.5 text-muted-foreground">覆盖 {Number(data.modelCount) || 0} 个模型</div>
      <div className="mt-1.5 text-base font-semibold text-foreground">{formatMetricValue(metric, value)}</div>
    </div>
  );
}

export function CompositeProviderTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as Record<string, unknown>;
  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="font-medium text-foreground">{String(data.provider || '--')}</div>
      <div className="mt-0.5 text-muted-foreground">TPS {formatNumber(Number(data.averageMedianTps))} · TTFT {formatNumber(Number(data.averageTtft), 0)} ms</div>
      <div className="mt-1.5 text-base font-semibold text-foreground">{formatNumber(Number(data.compositeScore))} 分</div>
    </div>
  );
}

export function CompositeModelTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as Record<string, unknown>;
  return (
    <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="font-medium text-foreground">{String(data.normalizedModelDisplay || data.model || '--')}</div>
      <div className="mt-0.5 text-muted-foreground">{String(data.provider || '')}</div>
      <div className="mt-1.5 text-base font-semibold text-foreground">{formatNumber(Number(data.compositeScore))} 分</div>
    </div>
  );
}

interface PerformanceTooltipProps extends TooltipProps<number, string> {
  metric: Metric;
}

export function PerformanceTooltip({ active, payload, label, metric }: PerformanceTooltipProps) {
  if (!active || !payload?.length) return null;
  const items = payload
    .filter((p) => Number.isFinite(p.value as number))
    .map((p) => {
      const original = (p.payload as Record<string, unknown>)[`${p.dataKey}_original`];
      return {
        name: p.name,
        color: p.color,
        value: (original as number) ?? (p.value as number),
        isCapped: original !== undefined && (original as number) > TTFT_CHART_MAX,
      };
    })
    .sort((l, r) => (metric === 'ttft' ? l.value - r.value : r.value - l.value));

  if (!items.length) return null;
  const displayed = items.slice(0, 8);
  const remaining = items.length - displayed.length;

  return (
    <div className="max-w-xs rounded-md border border-border bg-popover/95 p-3 text-xs shadow-md backdrop-blur-md">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-foreground">
        <span className="font-medium">{label ? new Date(label as number).toLocaleString('zh-CN') : '--'}</span>
        <span className="text-muted-foreground">{metric === 'ttft' ? 'TTFT' : 'MedianTPS'}</span>
      </div>
      <div className="space-y-1">
        {displayed.map((item) => (
          <div key={`${item.name}`} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
              <span className="truncate text-foreground">{item.name}</span>
            </span>
            <span className={`shrink-0 font-semibold ${item.isCapped ? 'text-rose-500' : 'text-foreground'}`}>
              {formatMetricValue(metric, item.value)}
              {item.isCapped ? ' ⚠' : ''}
            </span>
          </div>
        ))}
      </div>
      {remaining > 0 ? <div className="mt-1.5 text-[11px] text-muted-foreground">还有 {remaining} 条未展示</div> : null}
    </div>
  );
}
