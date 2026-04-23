import { useEffect, useMemo, useState } from 'react';
import { HistoryLineChart } from '@/components/charts/history-line-chart';
import { SectionCard } from '@/components/layout/section-card';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useHistoryData } from '@/hooks/use-history-data';
import { cn } from '@/lib/cn';
import { HISTORY_TIME_RANGES, type HistoryTimeRange } from '@/lib/constants';

type Metric = 'tps' | 'ttft';
type ViewMode = 'provider' | 'model';

const METRIC_OPTIONS = [
  { value: 'tps' as const, label: 'tok/s' },
  { value: 'ttft' as const, label: 'TTFT' },
];

const VIEW_OPTIONS = [
  { value: 'provider' as const, label: '厂家' },
  { value: 'model' as const, label: '模型' },
];

const TIME_RANGE_OPTIONS = HISTORY_TIME_RANGES.map((h) => {
  if (h === 2160) return { value: h, label: '90d' };
  if (h === 8760) return { value: h, label: '365d' };
  return {
    value: h,
    label: h < 24 ? `${h}h` : h === 24 ? '24h' : h < 168 ? `${h / 24}d` : h === 168 ? '7d' : `${h / 24}d`,
  };
});

export function TrendsRoute() {
  const { historyTimeRange, latest, setHistoryTimeRange } = useBenchmarkData();

  const [metric, setMetric] = useState<Metric>('tps');
  const [viewMode, setViewMode] = useState<ViewMode>('provider');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');

  const historyState = useHistoryData(historyTimeRange, true);
  const history = historyState.data;

  const providerOptions = useMemo(() => {
    return Array.from(new Set([...history.map((item) => item.provider), ...latest.map((item) => item.provider)])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [history, latest]);

  const modelOptions = useMemo(() => {
    const allModels = [
      ...history.map((item) => ({ model: item.model, modelDisplay: item.modelDisplay })),
      ...latest.map((item) => ({ model: item.model, modelDisplay: item.modelDisplay })),
    ];
    const seen = new Set<string>();
    const unique: Array<{ model: string; modelDisplay: string }> = [];
    allModels.forEach((m) => {
      if (!seen.has(m.model)) {
        seen.add(m.model);
        unique.push(m);
      }
    });
    return unique.sort((a, b) => a.model.localeCompare(b.model));
  }, [history, latest]);

  useEffect(() => {
    setProviderFilter('all');
    setModelFilter('all');
  }, [viewMode]);

  useEffect(() => {
    if (providerFilter !== 'all' && !providerOptions.includes(providerFilter)) {
      setProviderFilter('all');
    }
  }, [providerFilter, providerOptions]);

  useEffect(() => {
    if (modelFilter !== 'all' && !modelOptions.some((m) => m.model === modelFilter)) {
      setModelFilter('all');
    }
  }, [modelFilter, modelOptions]);

  const filteredHistory = useMemo(() => {
    let result = history;
    if (viewMode === 'provider' && providerFilter !== 'all') {
      result = result.filter((item) => item.provider === providerFilter);
    }
    if (viewMode === 'model' && modelFilter !== 'all') {
      result = result.filter((item) => item.model === modelFilter);
    }
    return result;
  }, [history, viewMode, providerFilter, modelFilter]);

  const filteredLatest = useMemo(() => {
    let result = latest;
    if (viewMode === 'provider' && providerFilter !== 'all') {
      result = result.filter((item) => item.provider === providerFilter);
    }
    if (viewMode === 'model' && modelFilter !== 'all') {
      result = result.filter((item) => item.model === modelFilter);
    }
    return result;
  }, [latest, viewMode, providerFilter, modelFilter]);

  const selectedTimeRangeLabel = TIME_RANGE_OPTIONS.find((option) => option.value === historyTimeRange)?.label ?? `${historyTimeRange}h`;

  const aggregationHint =
    historyTimeRange >= 8760
      ? '一年视图按天聚合，90 天前只保留每日最佳。'
      : historyTimeRange >= 2160
        ? '90 天视图保留小时级数据，建议配合筛选查看波动。'
        : '支持"全部 / 单个"真过滤，不是只高亮图例。';

  const emptyStateText = historyState.loading
    ? '正在加载历史分片…'
    : historyState.errorMessage
      ? '历史分片加载失败，请稍后重试。'
      : '暂无足够的历史数据，重新运行 CLI 导出后会逐步形成趋势曲线。';

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">趋势分析</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          按需拉取历史分片，支持 24h 到 365d 全时间范围，可切换厂家 / 模型视角与 tok/s / TTFT 指标。
        </p>
      </div>

      <SectionCard
        title={`最近 ${selectedTimeRangeLabel}`}
        subtitle={aggregationHint}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} size="sm" />
            <SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={setMetric} size="sm" />
            <SegmentedControl
              options={TIME_RANGE_OPTIONS}
              value={historyTimeRange}
              onChange={(value) => setHistoryTimeRange(value as HistoryTimeRange)}
              size="sm"
            />
          </div>
        }
      >
        {historyState.errorMessage ? (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {historyState.errorMessage}
          </div>
        ) : null}
        <HistoryLineChart
          historyData={filteredHistory}
          latestData={filteredLatest}
          metric={metric}
          emptyStateText={emptyStateText}
          viewMode={viewMode}
        />
        {viewMode === 'provider' && providerOptions.length > 0 ? (
          <div className="mt-4 flex max-w-full flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setProviderFilter('all')}
              className={cn(
                'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                providerFilter === 'all'
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
              )}
            >
              全部厂家
            </button>
            {providerOptions.map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setProviderFilter(provider)}
                className={cn(
                  'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  providerFilter === provider
                    ? 'border-primary/60 bg-primary/10 text-foreground'
                    : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
                )}
              >
                {provider}
              </button>
            ))}
          </div>
        ) : null}
        {viewMode === 'model' && modelOptions.length > 0 ? (
          <div className="mt-4 flex max-w-full flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModelFilter('all')}
              className={cn(
                'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                modelFilter === 'all'
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
              )}
            >
              全部模型
            </button>
            {modelOptions.map((m) => (
              <button
                key={m.model}
                type="button"
                onClick={() => setModelFilter(m.model)}
                className={cn(
                  'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  modelFilter === m.model
                    ? 'border-primary/60 bg-primary/10 text-foreground'
                    : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
                )}
              >
                {m.modelDisplay || m.model}
              </button>
            ))}
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
