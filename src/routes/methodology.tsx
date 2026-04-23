import { SectionCard } from '@/components/layout/section-card';

export function MethodologyRoute() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">测速方法论</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">本站各项指标的计算方式、数据质量保障，以及 AFF 推广披露。</p>
      </div>

      <SectionCard title="综合评分" subtitle="TPS 分 × 0.6 + TTFT 分 × 0.4，兼顾生成速度与首字响应。">
        <div className="grid gap-3 md:grid-cols-2">
          <FormulaBlock
            heading="TPS 分"
            formula="TPS 分 = min(100, MedianTPS)"
            description="线性计分，100 tok/s 即满分。"
          />
          <FormulaBlock
            heading="TTFT 分"
            formula="TTFT 分 = clamp(0, 100, 100 − 25 × log₂(TTFT / 300))"
            description="对数递减，TTFT 每翻倍扣 25 分。"
          />
        </div>
        <table className="mt-4 w-full max-w-xl overflow-hidden rounded-md border border-border/60 text-sm">
          <thead className="bg-secondary/40 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">TTFT</th>
              <th className="px-3 py-2 text-right">得分</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {[
              ['≤ 300ms', 100],
              ['600ms', 75],
              ['1200ms', 50],
              ['2400ms', 25],
              ['≥ 4800ms', 0],
            ].map(([label, score]) => (
              <tr key={`${label}`}>
                <td className="px-3 py-2 text-muted-foreground">{label}</td>
                <td className="px-3 py-2 text-right font-semibold num-tabular">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="吞吐 / 延迟指标">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 wide-grid-4">
          <FormulaBlock
            heading="MedianTPS（中位吞吐）"
            description="逐对计算相邻流式 chunk 的到达间隔，将每个间隔的 token 数 / 间隔秒数 得到瞬时 TPS。过滤 <50ms 的网络缓冲假间隔（被跳过间隔的 token 累加到下一有效间隔），再用 IQR 方法剔除离群值，最终取中位数。"
          />
          <FormulaBlock
            heading="AvgTPS（平均吞吐）"
            formula="AvgTPS = totalTokens / effectiveLatency"
            description="其中 effectiveLatency = 总耗时 - TTFT（首 token 后的纯生成时段）。作为 MedianTPS 的互补参考。"
          />
          <FormulaBlock
            heading="TTFT（首字延迟）"
            description="从 HTTP 请求发出到收到第一个 content token 的时间差。每轮测试前先发送一次预热请求以消除 Serverless 冷启动，确保 TTFT 反映模型真实推理启动速度。"
          />
        </div>
      </SectionCard>

      <SectionCard title="数据质量保障">
        <div className="grid gap-3 md:grid-cols-2">
          <FormulaBlock
            heading="异常检测与复测"
            description="当 AvgTPS > 500 或 MedianTPS > 500 时自动触发复测，最多重试 3 次。若仍异常则保留数据并标记为异常，排行榜和趋势图中会过滤掉超阈值的脏数据。"
          />
          <FormulaBlock
            heading="数据窗口"
            description="排行榜取最近 2 小时数据聚合；24 小时趋势按小时桶聚合绘制折线；性能历史保留 30 天、按小时桶取均值。每轮均含预热阶段以消除冷启动偏差。"
          />
        </div>
      </SectionCard>

      <SectionCard title="AFF 推广披露">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            本站点部分入口为 AFF（Affiliate）推广链接，通过该链接下单时，我方可能获得少量返利。通常这些链接会附带「邀请码 / 推荐码」，使购买者本身也可以享受到一定折扣或额外权益。
          </p>
          <p>
            所有 AFF 链接在点击前都会弹窗明确提示，供您选择继续或改用官方渠道。站点保留官方购买 / 官方文档链接作为备选，介意 AFF 可以直接使用它们。
          </p>
          <p>
            如果您发现某个入口的返利机制发生变更或存在误导，请通过社区评论或邮件告知，我们会及时更新。
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

function FormulaBlock({ heading, description, formula }: { heading: string; description: string; formula?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-4">
      <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
      {formula ? (
        <code className="block rounded-md bg-secondary/70 px-3 py-2 font-mono text-[12px] text-foreground">
          {formula}
        </code>
      ) : null}
      <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
