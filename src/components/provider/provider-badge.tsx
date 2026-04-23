import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';
import { ProviderGlyph } from './glyph';

export function ProviderBadge({ provider, model, className }: { provider: string; model?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md bg-secondary/60 px-2 py-0.5 text-xs font-medium text-foreground/90', className)}>
      <ProviderGlyph provider={provider} model={model} size={14} />
      <span>{provider}</span>
    </span>
  );
}

export function ProviderIdentity({ provider, model, extra }: { provider: string; model?: string; extra?: ReactNode }) {
  if (!provider) {
    return <span className="text-xs text-muted-foreground">等待数据</span>;
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <ProviderBadge provider={provider} model={model} />
      {extra ? <span className="text-muted-foreground">{extra}</span> : null}
    </div>
  );
}

export function ThinkingBadge() {
  return <Badge variant="secondary" className="bg-violet-500/15 text-violet-600 dark:text-violet-300">思考</Badge>;
}

export function AnomalyBadge({ providerMode = false }: { providerMode?: boolean }) {
  return (
    <Badge variant="warning" className="text-[10px]">
      {providerMode ? '含异常模型' : '模型异常'}
    </Badge>
  );
}

export function ProviderLogoWall({ providers, size = 26 }: { providers: Array<{ name: string; active: boolean; models?: Array<{ id: string }> }>; size?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="所有厂商标识">
      {providers.map((item) => (
        <span
          key={item.name}
          className={cn(
            'flex items-center justify-center rounded-md border border-border/40 p-1 transition-opacity',
            item.active ? 'bg-background/80' : 'bg-muted/40 opacity-60',
          )}
          title={`${item.name} · ${item.active ? '已配置 Key' : '待配置 Key'}`}
        >
          <ProviderGlyph provider={item.name} model={item.models?.[0]?.id || ''} size={size} />
        </span>
      ))}
    </div>
  );
}
