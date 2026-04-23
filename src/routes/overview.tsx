import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Sparkles, Timer } from 'lucide-react';
import { SectionCard, StatCard } from '@/components/layout/section-card';
import { LeaderboardRow } from '@/components/leaderboard/leaderboard-row';
import { MetricInfoHint } from '@/components/leaderboard/metric-info-hint';
import { ProviderGlyph } from '@/components/provider/glyph';
import { ProviderIdentity, ProviderLogoWall } from '@/components/provider/provider-badge';
import { Button } from '@/components/ui/button';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useEnrichedResults, useProviderAverages, useUndetectedProviders } from '@/hooks/use-derived';
import { formatNumber, formatTimestamp } from '@/lib/format';
import { PROVIDER_METRIC_ROTATION_MS } from '@/lib/constants';

export function OverviewRoute() {
  const { latest, providers, summary, lastUpdatedAt, loading, errorMessage } = useBenchmarkData();

  const enriched = useEnrichedResults(latest);
  const providerAverages = useProviderAverages(enriched);
  const undetected = useUndetectedProviders(enriched, providers);

  const topPerformer = enriched[0];
  const fastestTtft = useMemo(() => {
    const positives = enriched.filter((item) => Number.isFinite(item.avgTtft) && item.avgTtft > 0);
    return positives.length ? positives.reduce((best, item) => (!best || item.avgTtft < best.avgTtft ? item : best), positives[0]) : null;
  }, [enriched]);

  const [rotationIndex, setRotationIndex] = useState(0);
  useEffect(() => {
    if (providerAverages.length <= 1) {
      setRotationIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setRotationIndex((idx) => (idx + 1) % providerAverages.length);
    }, PROVIDER_METRIC_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [providerAverages]);

  const rotatedProvider = providerAverages.length ? providerAverages[rotationIndex % providerAverages.length] : null;
  const activeProviders = providers.filter((p) => p.active);

  const compositeTop = useMemo(
    () => [...enriched].sort((l, r) => r.compositeScore - l.compositeScore).slice(0, 5),
    [enriched],
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="absolute inset-0 gradient-mesh opacity-70" aria-hidden="true" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-[11px]">
              <Sparkles className="h-3 w-3 text-primary" />
              Coding Plan Benchmark
            </div>
            <h1 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              面向多厂商 Coding Plan 的真实测速与对比平台
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
              对比不同厂商、不同模型的首字延迟、MedianTPS 与综合响应体验。
              页面直接内嵌构建时快照，并基于近期历史 JSON 生成趋势图与排行榜。
            </p>
            <div className="flex flex-wrap gap-2 pt-1 sm:pt-2">
              <Button asChild size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
                <Link to="/leaderboards">
                  查看完整排行榜 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="sm:h-9 sm:px-4 sm:text-sm">
                <Link to="/compare">模型多厂家对比</Link>
              </Button>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px] lg:shrink-0 lg:grid-cols-1">
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Timer className="h-3.5 w-3.5" />
                下一次计划更新
              </div>
              <div className="mt-1 text-lg font-semibold num-tabular sm:mt-2 sm:text-xl">{summary.nextRunAt || '--'}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">通常由 daemon 或定时任务在每小时内随机触发一次。</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/70 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <Gauge className="h-3.5 w-3.5" />
                今日快照轮次
              </div>
              <div className="mt-1 text-lg font-semibold num-tabular sm:mt-2 sm:text-xl">
                {summary.dailyRunIndex > 0 ? `第 ${summary.dailyRunIndex} 轮` : '--'}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {summary.shanghaiDate ? `${summary.shanghaiDate}（上海时区）` : '等待首批结果'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {/* 3 core metric cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 wide-grid-3">
        <StatCard
          label="当前最快 MedianTPS"
          value={
            topPerformer
              ? `${formatNumber(topPerformer.medianTps || topPerformer.avgTps)} tok/s`
              : '--'
          }
          corner={
            topPerformer ? (
              <ProviderGlyph provider={topPerformer.provider} model={topPerformer.model} size={40} />
            ) : null
          }
          highlight={topPerformer ? <ProviderIdentity provider={topPerformer.provider} model={topPerformer.model} /> : null}
          detail={
            topPerformer
              ? `${topPerformer.normalizedModelDisplay}${topPerformer.avgTps ? ` · AvgTPS ${formatNumber(topPerformer.avgTps)}` : ''}`
              : '等待首批结果'
          }
        />
        <StatCard
          label="厂商平均 MedianTPS"
          contentKey={rotatedProvider ? `${rotatedProvider.provider}-${rotationIndex}` : 'empty'}
          value={
            rotatedProvider
              ? `${formatNumber(rotatedProvider.averageMedianTps || rotatedProvider.averageTps)} tok/s`
              : '--'
          }
          corner={
            rotatedProvider ? (
              <ProviderGlyph provider={rotatedProvider.provider} model={rotatedProvider.model} size={40} />
            ) : null
          }
          highlight={
            rotatedProvider ? (
              <ProviderIdentity
                provider={rotatedProvider.provider}
                model={rotatedProvider.model}
                extra={`覆盖 ${rotatedProvider.modelCount} 个模型`}
              />
            ) : null
          }
          detail={
            providerAverages.length > 1
              ? `按厂商轮播 · ${(rotationIndex % providerAverages.length) + 1}/${providerAverages.length}`
              : rotatedProvider
                ? '当前只展示一个已出结果厂商'
                : '等待首批结果'
          }
        />
        <StatCard
          label="最快 TTFT"
          value={fastestTtft ? `${formatNumber(fastestTtft.avgTtft, 0)} ms` : '--'}
          corner={fastestTtft ? <ProviderGlyph provider={fastestTtft.provider} model={fastestTtft.model} size={40} /> : null}
          highlight={fastestTtft ? <ProviderIdentity provider={fastestTtft.provider} model={fastestTtft.model} /> : null}
          detail={
            fastestTtft
              ? `${fastestTtft.normalizedModelDisplay}${lastUpdatedAt ? ` · 更新于 ${formatTimestamp(lastUpdatedAt)}` : ''}`
              : '等待数据加载'
          }
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <StatCard
          label="已接入厂商"
          value={`${providers.length}`}
          detail={`已激活 ${activeProviders.length} 个`}
          aside={<ProviderLogoWall providers={providers} size={22} />}
        />
        <StatCard
          label="待接入或待采购"
          value={`${undetected.length}`}
          detail="尚未获得本轮测速结果（缺少 Key 或调用失败）"
          aside={
            undetected.length ? (
              <div className="flex flex-wrap gap-1.5">
                {undetected.map((name) => (
                  <span key={name} className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">所有内置平台均已完成本轮拨测。</div>
            )
          }
        />
      </section>

      {/* Top 5 composite leaderboard */}
      <SectionCard
        title={
          <>
            综合排行榜 Top 5
            <MetricInfoHint metric="composite" label="查看综合评分算法" />
          </>
        }
        subtitle="综合评分 = TPS 分 × 0.6 + TTFT 分 × 0.4，兼顾生成速度与首字响应。"
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/leaderboards">
              查看全部
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      >
        <div className="flex flex-col gap-2">
          {loading && !compositeTop.length ? (
            <div className="text-sm text-muted-foreground">正在加载排行榜…</div>
          ) : !compositeTop.length ? (
            <div className="text-sm text-muted-foreground">暂无结果，请先配置环境变量并运行 `go run . run` 生成静态快照。</div>
          ) : (
            compositeTop.map((item, index) => (
              <LeaderboardRow
                key={`${item.provider}-${item.model}`}
                rank={index + 1}
                mode="model"
                provider={item.provider}
                model={item.model}
                displayName={item.normalizedModelDisplay}
                hasThinking={item.hasThinking}
                hasAnomaly={item.abnormalTps}
                primary={<>{formatNumber(item.compositeScore)} 分</>}
                secondary={
                  <>
                    TPS {formatNumber(item.medianTps || item.avgTps)} · TTFT {formatNumber(item.avgTtft, 0)} ms
                  </>
                }
              />
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
}
