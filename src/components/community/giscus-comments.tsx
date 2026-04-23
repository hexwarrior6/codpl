import { useEffect, useRef } from 'react';
import { ExternalLink, Github, MessageCircleMore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { giscusConfig, isGiscusConfigured } from '@/lib/giscus';

const REQUIRED_ENV_KEYS = [
  'VITE_GISCUS_REPO',
  'VITE_GISCUS_REPO_ID',
  'VITE_GISCUS_CATEGORY',
  'VITE_GISCUS_CATEGORY_ID',
] as const;

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolved } = useTheme();
  const ready = isGiscusConfigured(giscusConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ready) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', giscusConfig.repo);
    script.setAttribute('data-repo-id', giscusConfig.repoId);
    script.setAttribute('data-category', giscusConfig.category);
    script.setAttribute('data-category-id', giscusConfig.categoryId);
    script.setAttribute('data-mapping', giscusConfig.mapping);
    if (giscusConfig.term) {
      script.setAttribute('data-term', giscusConfig.term);
    }
    script.setAttribute('data-strict', giscusConfig.strict ? '1' : '0');
    script.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', giscusConfig.inputPosition);
    script.setAttribute('data-theme', resolved === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', giscusConfig.lang);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [ready, resolved]);

  if (!ready) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card">
            <MessageCircleMore className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">giscus 还没配置完成</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                当前页面已经接入 giscus 容器，但还缺少仓库或分类 ID。把下面这些变量填到 EO 的构建环境变量里，然后重新部署即可。
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {REQUIRED_ENV_KEYS.map((key) => (
                <code
                  key={key}
                  className="rounded-md border border-border/60 bg-secondary/50 px-3 py-2 text-[11px] text-foreground"
                >
                  {key}
                </code>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href="https://giscus.app/zh-CN" target="_blank" rel="noreferrer">
                  <Github className="h-3.5 w-3.5" />
                  打开 giscus 配置页
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://github.com/giscus/giscus" target="_blank" rel="noreferrer">
                  官方仓库
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-2 sm:p-3">
      <div ref={containerRef} className="giscus min-h-[140px]" />
    </div>
  );
}
