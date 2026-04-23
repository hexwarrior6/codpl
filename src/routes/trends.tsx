import { SectionCard } from '@/components/layout/section-card';
import { HistoryLineChart } from '@/components/charts/history-line-chart';
import { PerformanceAreaChart } from '@/components/charts/performance-area-chart';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useState } from 'react';
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

export function TrendsRoute() {
  const { history, latest, providerPerformance, modelPerformance, historyTimeRange, setHistoryTimeRange } = useBenchmarkData();

  const [historyMetric, setHistoryMetric] = useState<Metric>('tps');
  const [performanceViewMode, setPerformanceViewMode] = useState<ViewMode>('provider');
  const [providerMetric, setProviderMetric] = useState<Metric>('tps');
  const [modelMetric, setModelMetric] = useState<Metric>('tps');

  const timeRangeOptions = HISTORY_TIME_RANGES.map((h) => ({
    value: h,
    label: h < 24 ? `${h}h` : h === 24 ? '24h' : h < 168 ? `${h / 24}d` : h === 168 ? '7d' : `${h / 24}d`,
  }));

  const activePerfMetric = performanceViewMode === 'provider' ? providerMetric : modelMetric;
  const activePerfData = performanceViewMode === 'provider' ? providerPerformance : modelPerformance;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">趋势分析</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">24 小时至 90 天趋势联动展示，点击图例可单独高亮一条线。</p>
      </div>

      <Tabs defaultValue="short">
        <TabsList>
          <TabsTrigger value="short">短期趋势</TabsTrigger>
          <TabsTrigger value="long">性能历史（90 天）</TabsTrigger>
        </TabsList>

        <TabsContent value="short" className="mt-4">
          <SectionCard
            title={`最近 ${historyTimeRange} 小时`}
            subtitle="按 厂商 / 模型 分别绘制折线，展示过去一段时间内每条测速线的实际变化。"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <SegmentedControl
                  options={timeRangeOptions}
                  value={historyTimeRange}
                  onChange={(v) => setHistoryTimeRange(v as HistoryTimeRange)}
                  size="sm"
                />
                <SegmentedControl options={METRIC_OPTIONS} value={historyMetric} onChange={setHistoryMetric} size="sm" />
              </div>
            }
          >
            <HistoryLineChart
              historyData={history}
              latestData={latest}
              metric={historyMetric}
              emptyStateText="暂无足够的历史数据，重新运行 CLI 生成快照后会逐步形成趋势曲线。"
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="long" className="mt-4">
          <SectionCard
            title={`性能趋势 · 近 90 天${performanceViewMode === 'provider' ? '（厂家视角）' : '（模型视角）'}`}
            subtitle="每小时聚合（多轮预热后取 MedianTPS 平均），点击图例可单独查看某条曲线。"
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
              emptyStateText={`最近 90 天内暂无足够的${performanceViewMode === 'provider' ? '厂家' : '模型'}性能数据。`}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
