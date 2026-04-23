import { useMemo, useState } from 'react';
import { BookOpen, Copy, ExternalLink, Handshake, Search, ShoppingCart } from 'lucide-react';
import { SectionCard } from '@/components/layout/section-card';
import { ProviderGlyph } from '@/components/provider/glyph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AffiliateConfirmDialog } from '@/components/modals/affiliate-confirm-dialog';
import { useBenchmarkData } from '@/hooks/use-benchmark-data';
import { useCopy } from '@/hooks/use-copy';
import { resolveProviderAccessLinks, resolveProviderResourceUrl } from '@/lib/provider-registry';
import { normalizeModelDisplay } from '@/lib/model-normalize';
import { affiliateOffers, affiliatePromo } from '@/lib/affiliate-offers';
import { cn } from '@/lib/cn';

interface PendingAff {
  provider: string;
  url: string;
}

export function ProvidersRoute() {
  const { providers } = useBenchmarkData();
  const { feedback, copy } = useCopy();
  const [filter, setFilter] = useState('');
  const [pending, setPending] = useState<PendingAff | null>(null);

  const enriched = useMemo(
    () =>
      providers.map((item) => ({
        ...item,
        purchaseUrl: item.purchaseUrl || resolveProviderResourceUrl(item.name),
        accessLinks: resolveProviderAccessLinks(item.name),
        models: (item.models ?? []).map((model) => ({
          ...model,
          name: normalizeModelDisplay(model.id, model.name),
        })),
      })),
    [providers],
  );

  const filtered = useMemo(() => {
    if (!filter.trim()) return enriched;
    const q = filter.trim().toLowerCase();
    return enriched.filter((item) =>
      [item.name, item.platform, item.apiType, ...item.models.map((m) => `${m.id} ${m.name}`)].some((s) => `${s}`.toLowerCase().includes(q)),
    );
  }, [enriched, filter]);

  const confirmAffiliate = () => {
    if (!pending?.url) return;
    window.open(pending.url, '_blank', 'noopener,noreferrer');
    setPending(null);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">厂商 &amp; 采购</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          本站点无需任何捐赠，纯自费站点。下方展示所有厂商接入状态、官方文档入口以及合作推广位。点击 AFF 链接前会提示。
        </p>
      </div>

      <SectionCard
        title="推广位"
        subtitle="AFF 链接购买可能让你获得优惠，也会给站点带来返利；点击前会明确提示。"
      >
        <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm leading-relaxed">
          <div className="font-medium text-foreground">{affiliatePromo.title}</div>
          <div className="mt-1 text-muted-foreground">{affiliatePromo.description}</div>
          <Button
            variant="link"
            className="mt-1 h-auto p-0 text-primary"
            onClick={() => setPending({ provider: 'MiniMax', url: affiliatePromo.url })}
          >
            前往参与 <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 wide-grid-4">
          {affiliateOffers.map((offer) => (
            <article key={offer.key} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
              <header className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ProviderGlyph provider={offer.provider} model={offer.model} size={28} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-foreground">{offer.provider}</span>
                    <span className="text-[11px] text-muted-foreground">{offer.headline}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">{offer.accent}</Badge>
              </header>
              <p className="text-xs leading-relaxed text-muted-foreground">{offer.description}</p>
              <div className="text-xs font-medium text-primary">{offer.reward}</div>
              {offer.note ? <div className="text-[11px] text-muted-foreground">{offer.note}</div> : null}
              <div className="overflow-x-auto rounded-md bg-secondary/60 px-3 py-2 font-mono text-[11px] text-muted-foreground no-scrollbar">
                <span className="whitespace-nowrap">{offer.url}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex-1 min-w-[120px]" onClick={() => copy(offer.url, offer.key)}>
                  <Copy className="h-3.5 w-3.5" />
                  {feedback.key === offer.key ? feedback.message : '复制链接'}
                </Button>
                <Button size="sm" className="flex-1 min-w-[120px]" asChild>
                  <a href={offer.url} target="_blank" rel="noreferrer">
                    {offer.actionLabel}
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="厂商接入状态"
        subtitle={`共 ${enriched.length} 家，其中 ${enriched.filter((p) => p.active).length} 家已配置 Key。点击卡片上的按钮直达采购或文档。`}
        action={
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="搜索厂商 / 协议 / 模型"
              className="h-9 w-full pl-8 sm:h-8"
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 wide-grid-4">
          {filtered.map((item) => (
            <article
              key={item.name}
              className={cn(
                'flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-4 transition-colors',
                item.active ? 'hover:border-primary/40' : 'opacity-80',
              )}
            >
              <header className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border/40 bg-card">
                    <ProviderGlyph provider={item.name} model={item.models?.[0]?.id || ''} size={24} />
                  </span>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-semibold text-foreground" title={item.name}>{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">协议 · {item.apiType}</span>
                  </div>
                </div>
                <Badge variant={item.active ? 'success' : 'muted'}>
                  {item.active ? '已配置' : '待配置'}
                </Badge>
              </header>

              <div className="flex flex-wrap gap-1.5">
                {item.models.map((model) => (
                  <span
                    key={model.id}
                    className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] text-foreground/80"
                    title={model.id}
                  >
                    {model.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {item.accessLinks?.affiliate ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setPending({ provider: item.name, url: item.accessLinks!.affiliate!.url })}
                  >
                    <Handshake className="h-3.5 w-3.5" />
                    {item.accessLinks.affiliate.label}
                  </Button>
                ) : null}
                {item.accessLinks?.officialPurchase ? (
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.accessLinks.officialPurchase.url} target="_blank" rel="noreferrer">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {item.accessLinks.officialPurchase.label}
                    </a>
                  </Button>
                ) : null}
                {item.accessLinks?.docs ? (
                  <Button size="sm" variant="ghost" asChild>
                    <a href={item.accessLinks.docs.url} target="_blank" rel="noreferrer">
                      <BookOpen className="h-3.5 w-3.5" />
                      {item.accessLinks.docs.label}
                    </a>
                  </Button>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                    官方文档待补充
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
        {!filtered.length ? (
          <div className="mt-4 rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
            没有匹配的厂商。
          </div>
        ) : null}
      </SectionCard>

      <AffiliateConfirmDialog
        open={Boolean(pending)}
        provider={pending?.provider ?? ''}
        onCancel={() => setPending(null)}
        onConfirm={confirmAffiliate}
      />
    </div>
  );
}
