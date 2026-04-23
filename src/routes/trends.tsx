import { useEffect, useMemo, useState } from 'react';
import { HistoryLineChart } from '@/components/charts/history-line-chart';
import { PerformanceAreaChart } from '@/components/charts/performance-area-chart';
import { SectionCard } from '@/components/layout/section-card';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useHistoryData } from '@/hooks/use-history-data';
import { usePerformanceData } from '@/hooks/use-performance-data';
import { cn } from '@/lib/cn';
import { HISTORY_TIME_RANGES, type HistoryTimeRange } from '@/lib/constants';
import type { PerformanceRangeKey } from '@/lib/types';

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

const PERFORMANCE_RANGE_OPTIONS = [
  { value: '90d' as const, label: '90d·小时' },
  { value: '365d' as const, label: '365d·日最佳' },
];

export function TrendsRoute() {
  const { historyTimeRange, latest, setHistoryTimeRange } = useBenchmarkData();

  // 全局状态：指标 + 视角
  const [metric, setMetric] = useState<Metric>('tps');
  const [viewMode, setViewMode] = useState<ViewMode>('provider');

  // 长期趋势独立状态
  const [performanceRange, setPerformanceRange] = useState<PerformanceRangeKey>('365d');

  // 底部筛选状态
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');

  // 数据加载（短期 + 长期同时加载）
  const historyState = useHistoryData(historyTimeRange, true);
  const providerPerformanceState = usePerformanceData('provider', performanceRange, true);
  const modelPerformanceState = usePerformanceData('model', performanceRange, true);

  const history = historyState.data;
  const providerPerformance = providerPerformanceState.data;
  const modelPerformance = modelPerformanceState.data;

  const timeRangeOptions = HISTORY_TIME_RANGES.map((h) => {
    if (h === 2160) return { value: h, label: '90d·小时' };
    if (h === 8760) return { value: h, label: '365d·日最佳' };
    return {
      value: h,
      label: h < 24 ? `${h}h` : h === 24 ? '24h' : h < 168 ? `${h / 24}d` : h === 168 ? '7d' : `${h / 24}d`,
    };
  });

  // 厂家选项
  const providerOptions = useMemo(() => {
    return Array.from(new Set([...history.map((item) => item.provider), ...latest.map((item) => item.provider)])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [history, latest]);

  // 模型选项
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

  // 切换视角时重置筛选
  useEffect(() => {
    setProviderFilter('all');
    setModelFilter('all');
  }, [viewMode]);

  // 选项变化时重置无效筛选
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

  // 过滤后的短期数据
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

  // 长期趋势：根据视角选择对应数据集
  const activePerfState = viewMode === 'provider' ? providerPerformanceState : modelPerformanceState;
  const activePerfData = viewMode === 'provider' ? providerPerformance : modelPerformance;

  const selectedTimeRangeLabel = timeRangeOptions.find((option) => option.value === historyTimeRange)?.label ?? `${historyTimeRange}h`;

  const historyAggregationHint =
    historyTimeRange >= 8760
      ? '一年视图中，这条折线按天聚合展示，且 90 天前只保留每日最佳。'
      : historyTimeRange >= 2160
        ? '90 天视图继续保留小时级数据，建议配合筛选查看波动。'
        : '短期趋势支持“全部 / 单个”真过滤，不是只高亮图例。';

  const historyEmptyStateText = historyState.loading
    ? '正在加载历史分片…'
    : historyState.errorMessage
      ? '历史分片加载失败，请稍后重试。'
      : '暂无足够的历史数据，重新运行 CLI 导出后会逐步形成趋势曲线。';

  const performanceEmptyStateText = activePerfState.loading
    ? '正在加载长期趋势分片…'
    : activePerfState.errorMessage
      ? '长期趋势分片加载失败，请稍后重试。'
      : `最近 ${performanceRange === '90d' ? '90 天' : '1 年'}内暂无足够的${viewMode === 'provider' ? '厂家' : '模型'}性能数据。`;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* 标题 + 全局控制栏 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">趋势分析</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            首次进入只拉首页 bootstrap；进入趋势页后按需拉取折线与长期趋势分片，避免首屏背上整年历史。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} size="sm" />
          <SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={setMetric} size="sm" />
        </div>
      </div>

      {/* 短期趋势 */}
      <SectionCard
        title={`最近 ${selectedTimeRangeLabel}`}
        subtitle={`按 ${viewMode === 'provider' ? '厂商' : '模型'} 绘制折线，展示过去一段时间内每条测速线的实际变化。${historyAggregationHint}`}
        action={
          <SegmentedControl
            options={timeRangeOptions}
            value={historyTimeRange}
            onChange={(value) => setHistoryTimeRange(value as HistoryTimeRange)}
            size="sm"
          />
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
          emptyStateText={historyEmptyStateText}
        />
        {/* 底部筛选按钮 */}
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

      {/* 长期趋势 */}
      <SectionCard
        title={`性能趋势 · ${performanceRange === '90d' ? '近 90 天' : '近 1 年'}（${viewMode === 'provider' ? '厂家视角' : '模型视角'}）`}
        subtitle={
          performanceRange === '90d'
            ? '90d·小时：全部按小时聚合，适合看近期波动。'
            : '365d·日最佳：最近 90 天按小时聚合，更早历史按天展示，并且 90 天前只保留每日最佳。'
        }
        action={
          <SegmentedControl
            options={PERFORMANCE_RANGE_OPTIONS}
            value={performanceRange}
            onChange={(value) => setPerformanceRange(value as PerformanceRangeKey)}
            size="sm"
          />
        }
      >
        {activePerfState.errorMessage ? (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {activePerfState.errorMessage}
          </div>
        ) : null}
        <div className="mb-4 rounded-lg border border-border/60 bg-background/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          最近 90 天按小时聚合；更早历史按天，仅保留每日最佳。
        </div>
        <PerformanceAreaChart
          points={activePerfData}
          metric={metric}
          emptyStateText={performanceEmptyStateText}
        />
      </SectionCard>
    </div>
  );
}
