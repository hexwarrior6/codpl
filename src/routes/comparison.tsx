import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { SectionCard } from '@/components/layout/section-card';
import { SegmentedControl } from '@/components/leaderboard/segmented-control';
import { ProviderBadge } from '@/components/provider/provider-badge';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useModelComparison, useModelListData } from '@/hooks/use-model-comparison';
import { cn } from '@/lib/cn';
import { DOMESTIC_WINDOW_OPTIONS, type DomesticWindow } from '@/lib/constants';
import { formatDuration, formatNumber, formatPercent, formatRelativeTime } from '@/lib/format';
import { computeCompositeScore } from '@/lib/scoring';
import type { ModelProviderRow } from '@/lib/types';

interface Column {
  key: keyof ModelProviderRow | 'compositeScore';
  label: string;
  firstDir: 'asc' | 'desc';
  sortType: 'number' | 'string' | 'date';
  align?: 'left' | 'right';
}

const COLUMNS: Column[] = [
  { key: 'provider', label: '厂家', firstDir: 'asc', sortType: 'string', align: 'left' },
  { key: 'avgMedianTps', label: 'MedianTPS', firstDir: 'desc', sortType: 'number', align: 'right' },
  { key: 'ttftP50', label: 'TTFT P50', firstDir: 'asc', sortType: 'number', align: 'right' },
  { key: 'ttftP95', label: 'TTFT P95', firstDir: 'asc', sortType: 'number', align: 'right' },
  { key: 'successRate', label: '成功率', firstDir: 'desc', sortType: 'number', align: 'right' },
  { key: 'avgLatency', label: '平均总耗时', firstDir: 'asc', sortType: 'number', align: 'right' },
  { key: 'sampleCount', label: '样本数', firstDir: 'desc', sortType: 'number', align: 'right' },
  { key: 'latestProbeAt', label: '最近测速', firstDir: 'desc', sortType: 'date', align: 'right' },
];

type SortState = { key: Column['key'] | null; direction: 'asc' | 'desc' | null };

export function ComparisonRoute() {
  const { comparisonModel, comparisonWindow, setComparisonModel, setComparisonWindow } = useBenchmarkData();
  const modelListState = useModelListData(true);
  const comparisonState = useModelComparison(comparisonModel, comparisonWindow, Boolean(comparisonModel));
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: null });

  const multiProviderModels = useMemo(
    () => modelListState.data.filter((item) => item.providerCount >= 2),
    [modelListState.data],
  );
  const selectedModel = useMemo(
    () => multiProviderModels.find((item) => item.logicalModelId === comparisonModel) ?? null,
    [comparisonModel, multiProviderModels],
  );

  useEffect(() => {
    if (!comparisonModel && multiProviderModels.length) {
      setComparisonModel(multiProviderModels[0].logicalModelId);
      return;
    }

    if (comparisonModel && !multiProviderModels.some((item) => item.logicalModelId === comparisonModel)) {
      setComparisonModel(multiProviderModels[0]?.logicalModelId ?? '');
    }
  }, [comparisonModel, multiProviderModels, setComparisonModel]);

  const withComposite = useMemo(
    () =>
      comparisonState.data.map((item) => ({
        ...item,
        compositeScore: computeCompositeScore(item.avgMedianTps || 0, item.ttftP50 || 0).composite,
      })),
    [comparisonState.data],
  );

  const sorted = useMemo(() => {
    const defaultSort = (list: typeof withComposite) =>
      list.slice().sort((left, right) => {
        if (right.compositeScore !== left.compositeScore) return right.compositeScore - left.compositeScore;
        if ((right.avgMedianTps || 0) !== (left.avgMedianTps || 0)) return (right.avgMedianTps || 0) - (left.avgMedianTps || 0);
        if ((left.ttftP50 || 0) !== (right.ttftP50 || 0)) return (left.ttftP50 || 0) - (right.ttftP50 || 0);
        if ((right.successRate || 0) !== (left.successRate || 0)) return (right.successRate || 0) - (left.successRate || 0);
        return `${left.provider || ''}`.localeCompare(`${right.provider || ''}`);
      });

    if (!sortState.key || !sortState.direction) return defaultSort(withComposite);

    const column = COLUMNS.find((item) => item.key === sortState.key);
    if (!column) return defaultSort(withComposite);

    const direction = sortState.direction === 'asc' ? 1 : -1;
    return [...withComposite].sort((left, right) => {
      const leftValue = (left as Record<string, unknown>)[column.key];
      const rightValue = (right as Record<string, unknown>)[column.key];

      let comparison = 0;
      if (column.sortType === 'string') comparison = `${leftValue ?? ''}`.localeCompare(`${rightValue ?? ''}`);
      else if (column.sortType === 'date') comparison = (leftValue ? new Date(String(leftValue)).getTime() : 0) - (rightValue ? new Date(String(rightValue)).getTime() : 0);
      else comparison = (Number(leftValue) || 0) - (Number(rightValue) || 0);

      if (comparison !== 0) return comparison * direction;
      return `${left.provider || ''}`.localeCompare(`${right.provider || ''}`);
    });
  }, [sortState, withComposite]);

  const handleSort = (column: Column) => {
    setSortState((previous) => {
      if (previous.key !== column.key) return { key: column.key, direction: column.firstDir };
      if (previous.direction === column.firstDir) {
        return { key: column.key, direction: column.firstDir === 'asc' ? 'desc' : 'asc' };
      }
      return { key: null, direction: null };
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">模型多厂家对比</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          先加载数据库历史里的模型列表，再按你选择的模型和时间窗口懒加载单独分片，停拨测模型也能继续查看历史。
        </p>
      </div>

      <SectionCard
        title="选择模型"
        subtitle={`当前窗口 ${comparisonWindow}，按综合评分排序。`}
        action={
          <SegmentedControl
            options={DOMESTIC_WINDOW_OPTIONS.map((item) => ({ value: item, label: item }))}
            value={comparisonWindow}
            onChange={(value) => setComparisonWindow(value as DomesticWindow)}
            size="sm"
          />
        }
      >
        {modelListState.errorMessage ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
            {modelListState.errorMessage}
          </div>
        ) : multiProviderModels.length ? (
          <div className="-mx-1 flex flex-wrap gap-2 px-1">
            {multiProviderModels.map((item) => (
              <button
                key={item.logicalModelId}
                onClick={() => setComparisonModel(item.logicalModelId)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                  comparisonModel === item.logicalModelId
                    ? 'border-primary/60 bg-primary/10 text-foreground shadow-sm'
                    : 'border-border/60 bg-background/60 text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                <span className="max-w-[14ch] truncate">{item.displayName}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{item.providerCount} 家</span>
              </button>
            ))}
          </div>
        ) : modelListState.loading ? (
          <div className="text-sm text-muted-foreground">正在加载模型列表…</div>
        ) : (
          <div className="text-sm text-muted-foreground">暂无多厂家共有的历史模型。</div>
        )}
      </SectionCard>

      {comparisonModel ? (
        <SectionCard
          title={`${selectedModel?.displayName ?? comparisonModel} · 跨厂家对比`}
          subtitle="点击表头可切换排序方向；窄屏下以卡片形式展示。"
        >
          {comparisonState.errorMessage ? (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              {comparisonState.errorMessage}
            </div>
          ) : null}

          {sorted.length ? (
            <>
              <div className="hidden overflow-x-auto rounded-lg border border-border/60 md:block">
                <table className="min-w-full divide-y divide-border/60 text-sm">
                  <thead className="bg-secondary/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {COLUMNS.map((column) => {
                        const isActive = sortState.key === column.key;
                        const indicator = isActive
                          ? sortState.direction === 'asc'
                            ? <ArrowUp className="h-3 w-3" />
                            : <ArrowDown className="h-3 w-3" />
                          : <ArrowUpDown className="h-3 w-3 opacity-60" />;

                        return (
                          <th key={String(column.key)} className={cn('px-4 py-3', column.align === 'right' ? 'text-right' : 'text-left')}>
                            <button
                              type="button"
                              onClick={() => handleSort(column)}
                              className={cn(
                                'inline-flex items-center gap-1 font-semibold transition-colors',
                                column.align === 'right' && 'ml-auto',
                                isActive ? 'text-foreground' : 'hover:text-foreground',
                              )}
                              aria-label={`按 ${column.label} 排序`}
                            >
                              {column.label}
                              {indicator}
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 bg-card/60">
                    {sorted.map((item) => (
                      <tr key={`${item.provider}-${item.providerPlatform}`} className="hover:bg-secondary/30">
                        <td className="px-4 py-3">
                          <ProviderBadge provider={item.provider} model={comparisonModel} />
                        </td>
                        <td className="px-4 py-3 text-right num-tabular">
                          <span className="font-semibold">{formatNumber(item.avgMedianTps)}</span>
                          <span className="ml-1 text-xs text-muted-foreground">tok/s</span>
                        </td>
                        <td className="px-4 py-3 text-right num-tabular">{formatNumber(item.ttftP50, 0)} ms</td>
                        <td className="px-4 py-3 text-right num-tabular">{formatNumber(item.ttftP95, 0)} ms</td>
                        <td className="px-4 py-3 text-right num-tabular">
                          <span className="font-semibold">{formatPercent(item.successRate)}</span>
                        </td>
                        <td className="px-4 py-3 text-right num-tabular">{formatDuration(item.avgLatency)}</td>
                        <td className="px-4 py-3 text-right num-tabular">{item.sampleCount}</td>
                        <td className="px-4 py-3 text-right text-xs text-muted-foreground">{formatRelativeTime(item.latestProbeAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 md:hidden">
                {sorted.map((item) => (
                  <article
                    key={`${item.provider}-${item.providerPlatform}-mobile`}
                    className="rounded-xl border border-border/60 bg-background/60 p-3"
                  >
                    <header className="flex items-center justify-between gap-2">
                      <ProviderBadge provider={item.provider} model={comparisonModel} />
                      <span className="text-[11px] text-muted-foreground">{formatRelativeTime(item.latestProbeAt)}</span>
                    </header>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">MedianTPS</dt>
                        <dd className="num-tabular font-semibold text-foreground">
                          {formatNumber(item.avgMedianTps)} <span className="text-[10px] font-normal text-muted-foreground">tok/s</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">成功率</dt>
                        <dd className="num-tabular font-semibold text-foreground">{formatPercent(item.successRate)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">TTFT P50</dt>
                        <dd className="num-tabular text-foreground">{formatNumber(item.ttftP50, 0)} ms</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">TTFT P95</dt>
                        <dd className="num-tabular text-foreground">{formatNumber(item.ttftP95, 0)} ms</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">平均耗时</dt>
                        <dd className="num-tabular text-foreground">{formatDuration(item.avgLatency)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">样本数</dt>
                        <dd className="num-tabular text-foreground">{item.sampleCount}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          ) : comparisonState.loading ? (
            <div className="text-sm text-muted-foreground">正在加载对比分片…</div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              当前窗口内暂无该模型的测速数据。
            </div>
          )}
        </SectionCard>
      ) : null}
    </div>
  );
}

