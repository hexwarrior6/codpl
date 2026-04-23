import { useEffect, useMemo, useState } from 'react';
import { HistoryLineChart } from '@/components/charts/history-line-chart';
import { PerformanceAreaChart } from '@/components/charts/performance-area-chart';
import { SectionCard } from '@/components/layout/section-card';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useHistoryData } from '@/hooks/use-history-data';
import { usePerformanceData } from '@/hooks/use-performance-data';
import { cn } from '@/lib/cn';
import { HISTORY_TIME_RANGES, type HistoryTimeRange } from '@/lib/constants';
import type { PerformanceRangeKey } from '@/lib/types';

type Metric = 'tps' | 'ttft';
type ViewMode = 'provider' | 'model';
type TrendsTab = 'short' | 'long';

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
  const [activeTab, setActiveTab] = useState<TrendsTab>('short');
  const [historyMetric, setHistoryMetric] = useState<Metric>('tps');
  const [performanceViewMode, setPerformanceViewMode] = useState<ViewMode>('provider');
  const [performanceRange, setPerformanceRange] = useState<PerformanceRangeKey>('365d');
  const [providerMetric, setProviderMetric] = useState<Metric>('tps');
  const [modelMetric, setModelMetric] = useState<Metric>('tps');
  const [historyProviderFilter, setHistoryProviderFilter] = useState<string>('all');

  const historyState = useHistoryData(historyTimeRange, activeTab === 'short');
  const providerPerformanceState = usePerformanceData(
    'provider',
    performanceRange,
    activeTab === 'long' && performanceViewMode === 'provider',
  );
  const modelPerformanceState = usePerformanceData(
    'model',
    performanceRange,
    activeTab === 'long' && performanceViewMode === 'model',
  );

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

  const historyProviderOptions = useMemo(() => {
    return Array.from(new Set([...history.map((item) => item.provider), ...latest.map((item) => item.provider)])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [history, latest]);

  useEffect(() => {
    if (historyProviderFilter !== 'all' && !historyProviderOptions.includes(historyProviderFilter)) {
      setHistoryProviderFilter('all');
    }
  }, [historyProviderFilter, historyProviderOptions]);

  const filteredHistory = useMemo(
    () => (historyProviderFilter === 'all' ? history : history.filter((item) => item.provider === historyProviderFilter)),
    [history, historyProviderFilter],
  );
  const filteredLatest = useMemo(
    () => (historyProviderFilter === 'all' ? latest : latest.filter((item) => item.provider === historyProviderFilter)),
    [latest, historyProviderFilter],
  );

  const activePerfMetric = performanceViewMode === 'provider' ? providerMetric : modelMetric;
  const activePerfState = performanceViewMode === 'provider' ? providerPerformanceState : modelPerformanceState;
  const activePerfData = performanceViewMode === 'provider' ? providerPerformance : modelPerformance;
  const selectedTimeRangeLabel = timeRangeOptions.find((option) => option.value === historyTimeRange)?.label ?? `${historyTimeRange}h`;
  const historyAggregationHint =
    historyTimeRange >= 8760
      ? '一年视图中，这条折线按天聚合展示，且 90 天前只保留每日最佳。'
      : historyTimeRange >= 2160
        ? '90 天视图继续保留小时级数据，建议配合厂家筛选查看波动。'
        : '短期趋势支持“全部厂家 / 单个厂家”真过滤，不是只高亮图例。';

  const historyEmptyStateText = historyState.loading
    ? '正在加载历史分片…'
    : historyState.errorMessage
      ? '历史分片加载失败，请稍后重试。'
      : '暂无足够的历史数据，重新运行 CLI 导出后会逐步形成趋势曲线。';

  const performanceEmptyStateText = activePerfState.loading
    ? '正在加载长期趋势分片…'
    : activePerfState.errorMessage
      ? '长期趋势分片加载失败，请稍后重试。'
      : `最近 ${performanceRange === '90d' ? '90 天' : '1 年'}内暂无足够的${performanceViewMode === 'provider' ? '厂家' : '模型'}性能数据。`;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">趋势分析</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          首次进入只拉首页 bootstrap；切到趋势页后再按范围拉取折线与长期趋势分片，避免首屏背上整年历史。
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TrendsTab)}>
        <TabsList>
          <TabsTrigger value="short">短期趋势</TabsTrigger>
          <TabsTrigger value="long">长期趋势</TabsTrigger>
        </TabsList>

        <TabsContent value="short" className="mt-4">
          <SectionCard
            title={`最近 ${selectedTimeRangeLabel}`}
            subtitle={`按 厂商 / 模型 绘制折线，展示过去一段时间内每条测速线的实际变化。${historyAggregationHint}`}
            action={
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex flex-wrap items-center gap-2">
                  <SegmentedControl
                    options={timeRangeOptions}
                    value={historyTimeRange}
                    onChange={(value) => setHistoryTimeRange(value as HistoryTimeRange)}
                    size="sm"
                  />
                  <SegmentedControl options={METRIC_OPTIONS} value={historyMetric} onChange={setHistoryMetric} size="sm" />
                </div>
                {historyProviderOptions.length ? (
                  <div className="flex max-w-full flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setHistoryProviderFilter('all')}
                      className={cn(
                        'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                        historyProviderFilter === 'all'
                          ? 'border-primary/60 bg-primary/10 text-foreground'
                          : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
                      )}
                    >
                      全部厂家
                    </button>
                    {historyProviderOptions.map((provider) => (
                      <button
                        key={provider}
                        type="button"
                        onClick={() => setHistoryProviderFilter(provider)}
                        className={cn(
                          'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors',
                          historyProviderFilter === provider
                            ? 'border-primary/60 bg-primary/10 text-foreground'
                            : 'border-border/60 bg-background/60 text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                ) : null}
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
              metric={historyMetric}
              emptyStateText={historyEmptyStateText}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="long" className="mt-4">
          <SectionCard
            title={`性能趋势 · ${performanceRange === '90d' ? '近 90 天' : '近 1 年'}${performanceViewMode === 'provider' ? '（厂家视角）' : '（模型视角）'}`}
            subtitle={
              performanceRange === '90d'
                ? '90d·小时：全部按小时聚合，适合看近期波动。'
                : '365d·日最佳：最近 90 天按小时聚合，更早历史按天展示，并且 90 天前只保留每日最佳。'
            }
            action={
              <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl
                  options={PERFORMANCE_RANGE_OPTIONS}
                  value={performanceRange}
                  onChange={(value) => setPerformanceRange(value as PerformanceRangeKey)}
                  size="sm"
                />
                <SegmentedControl options={VIEW_OPTIONS} value={performanceViewMode} onChange={setPerformanceViewMode} size="sm" />
                <SegmentedControl
                  options={METRIC_OPTIONS}
                  value={activePerfMetric}
                  onChange={(value) => (performanceViewMode === 'provider' ? setProviderMetric(value) : setModelMetric(value))}
                  size="sm"
                />
              </div>
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
              metric={activePerfMetric}
              emptyStateText={performanceEmptyStateText}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

