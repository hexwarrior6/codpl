import { MessageSquareText } from 'lucide-react';
import { GiscusComments } from '@/components/community/giscus-comments';
import { SectionCard } from '@/components/layout/section-card';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { formatRelativeTime, formatTimestamp } from '@/lib/format';

export function CommunityRoute() {
  const { lastUpdatedAt, snapshots } = useBenchmarkData();

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <MessageSquareText className="h-5 w-5 text-primary" aria-hidden="true" />
          社区
        </h1>
      </div>

      <SectionCard
        title="当前数据状态"
        subtitle="这里展示的是构建期快照信息，而不是实时服务状态。"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">最近一次生成</div>
            <div className="mt-2 text-lg font-semibold">{lastUpdatedAt ? formatTimestamp(lastUpdatedAt) : '--'}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {lastUpdatedAt ? `${formatRelativeTime(lastUpdatedAt)} · 静态快照已写入构建产物` : '等待首个构建快照'}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">保留的历史快照</div>
            <div className="mt-2 text-lg font-semibold">{snapshots.length}</div>
            <div className="mt-1 text-xs text-muted-foreground">后端 CLI 会从这些 JSON 快照重建历史趋势与跨厂商对比。</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="评论区"
        subtitle="评论由 GitHub Discussions 托管，页面仍然保持纯静态部署。首次评论时，giscus 会按页面映射自动关联或创建讨论。"
      >
        <GiscusComments />
      </SectionCard>
    </div>
  );
}
