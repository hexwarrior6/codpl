import { SectionCard } from '@/components/layout/section-card';
import { HistoryLineChart } from '@/components/charts/history-line-chart';
import { PerformanceAreaChart } from '@/components/charts/performance-area-chart';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useEffect, useMemo, useState } from 'react';
import { HISTORY_TIME_RANGES, type HistoryTimeRange } from '@/lib/constants';
import { cn } from '@/lib/cn';

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

export function TrendsRoute() {
  const { history, latest, providerPerformance, modelPerformance, historyTimeRange, setHistoryTimeRange } = useBenchmarkData();

  const [historyMetric, setHistoryMetric] = useState<Metric>('tps');
  const [performanceViewMode, setPerformanceViewMode] = useState<ViewMode>('provider');
  const [providerMetric, setProviderMetric] = useState<Metric>('tps');
  const [modelMetric, setModelMetric] = useState<Metric>('tps');
  const [historyProviderFilter, setHistoryProviderFilter] = useState<string>('all');

  const timeRangeOptions = HISTORY_TIME_RANGES.map((h) => {
    if (h === 2160) return { value: h, label: '90d·小时' };
    if (h === 8760) return { value: h, label: '365d·日最佳' };
    return {
      value: h,
      label: h < 24 ? `${h}h` : h === 24 ? '24h' : h < 168 ? `${h / 24}d` : h === 168 ? '7d' : `${h / 24}d`,
    };
  });

  const historyProviderOptions = useMemo(() => {
    return Array.from(new Set([...history.map((item) => item.provider), ...latest.map((item) => item.provider)])).sort((a, b) => a.localeCompare(b));
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
  const activePerfData = performanceViewMode === 'provider' ? providerPerformance : modelPerformance;
  const selectedTimeRangeLabel = timeRangeOptions.find((option) => option.value === historyTimeRange)?.label ?? `${historyTimeRange}h`;
  const historyAggregationHint =
    historyTimeRange >= 8760
      ? '一年视图中，最近 90 天按小时聚合；更早历史按天仅保留每日最佳。'
      : historyTimeRange >= 2160
        ? '90 天视图保留小时级数据，曲线会更密集，建议结合厂家筛选查看。'
        : '支持按厂家筛选，便于查看单个平台的短期波动。';

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">趋势分析</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">24 小时到一年的趋势都可以看，短期支持按厂家筛选，长期会清楚标注聚合口径。</p>
      </div>

      <Tabs defaultValue="short">
        <TabsList>
          <TabsTrigger value="short">短期趋势</TabsTrigger>
          <TabsTrigger value="long">性能历史（1 年）</TabsTrigger>
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
                    onChange={(v) => setHistoryTimeRange(v as HistoryTimeRange)}
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
            <HistoryLineChart
              historyData={filteredHistory}
              latestData={filteredLatest}
              metric={historyMetric}
              emptyStateText="暂无足够的历史数据，重新运行 CLI 生成快照后会逐步形成趋势曲线。"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="long" className="mt-4">
          <SectionCard
            title={`性能趋势 · 近 1 年${performanceViewMode === 'provider' ? '（厂家视角）' : '（模型视角）'}`}
            subtitle="最近 90 天按小时聚合；更早历史按天仅保留每日最佳。点击图例可单独查看某条曲线。"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl options={VIEW_OPTIONS} value={performanceViewMode} onChange={setPerformanceViewMode} size="sm" />
                <SegmentedControl
                  options={METRIC_OPTIONS}
                  value={activePerfMetric}
                  onChange={(v) => (performanceViewMode === 'provider' ? setProviderMetric(v) : setModelMetric(v))}
                  size="sm"
                />
              </div>
            }
          >
            <PerformanceAreaChart
              points={activePerfData}
              metric={activePerfMetric}
              emptyStateText={`最近 1 年内暂无足够的${performanceViewMode === 'provider' ? '厂家' : '模型'}性能数据。`}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
