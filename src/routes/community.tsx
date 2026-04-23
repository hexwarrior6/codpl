import type { ReactNode } from 'react';
import { GitBranch, History, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GiscusComments } from '@/components/community/giscus-comments';
import { SectionCard } from '@/components/layout/section-card';
import { Button } from '@/components/ui/button';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { formatRelativeTime, formatTimestamp } from '@/lib/format';

export function CommunityRoute() {
  const { lastUpdatedAt, snapshots } = useBenchmarkData();

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <MessageSquareText className="h-5 w-5 text-primary" aria-hidden="true" />
          社区与协作
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          站点已经切换为纯静态部署，因此不再内置登录、评论和服务端会话；讨论与协作建议放到仓库工作流或外部社区里完成。
        </p>
      </div>

      <SectionCard
        title="为什么不再内置留言板"
        subtitle="静态站点只负责展示构建期生成的结果快照，不再承担运行时写接口。"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard
            icon={<GitBranch className="h-4 w-4 text-primary" />}
            title="提交即留痕"
            description="每一轮拨测都会生成新的 JSON 快照并进入 Git 历史，数据变更天然可追溯。"
          />
          <InfoCard
            icon={<History className="h-4 w-4 text-primary" />}
            title="部署更轻"
            description="没有常驻 Go 服务、数据库会话和评论接口，Cloudflare Pages 只需托管静态产物。"
          />
          <InfoCard
            icon={<MessageSquareText className="h-4 w-4 text-primary" />}
            title="讨论外置"
            description="需要交流时，建议放到仓库 Issue / Discussion、触发构建的 PR，或其他外部社区线程中。"
          />
        </div>
      </SectionCard>

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

function InfoCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-card">{icon}</div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
