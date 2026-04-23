import { Heart, KeyRound, Mail, Sparkles } from 'lucide-react';
import { SectionCard } from '@/components/layout/section-card';

const CONTACT_EMAIL = 'hloolmz@qq.com';

interface DonorEntry {
  platform: string;
  donor: string;
  link: string;
}

const DONORS: DonorEntry[] = [
  { platform: '腾讯云', donor: '@omega001', link: 'https://linux.do/u/omega001' },
  { platform: '元景', donor: '@黑色小笼包', link: 'https://linux.do/u/adgg' },
  { platform: 'OLLAMA', donor: '@over04', link: 'https://linux.do/u/2838828011' },
];

export function DonateRoute() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl">
          <Heart className="h-5 w-5 text-rose-500" aria-hidden="true" />
          支持捐赠平台 Key
        </h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          本站点几乎全部自费运营，仅部分平台由于<strong>购买不到</strong>、或者<strong>受众较小不便自行采购</strong>
          ，依赖社区捐赠 API Key 才能完成拨测。下面是当前已接入的捐赠来源，感谢每一位朋友的支持。
        </p>
      </div>

      <SectionCard
        title="来自捐赠者的 Key"
        subtitle="以下平台的测速数据由对应捐赠者提供 API Key，点击可查看捐赠者主页。"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DONORS.map((entry) => (
            <a
              key={entry.platform}
              href={entry.link}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-4 py-3 no-underline transition-colors hover:border-primary/40 hover:bg-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  感谢 {entry.platform} 捐赠
                </span>
                <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                  {entry.donor}
                </span>
              </div>
            </a>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="想要捐赠 Key？"
        subtitle="任何未覆盖的平台、或者你手头闲置额度较多的 Key，都欢迎通过邮箱联系。"
      >
        <div className="flex flex-col gap-4">
          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">透明致谢：</span>
                捐赠者的昵称会在本页和对应平台的榜单说明中展示，也可选择匿名。
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">Key 只用于拨测：</span>
                仅用于按方法论跑既定题目，不外传、不转售、不用于其他用途。
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">额度可控：</span>
                可提前约定单日调用次数上限，避免被跑爆。
              </span>
            </li>
            <li className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/60 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">随时撤回：</span>
                如果你需要停止捐赠，邮件告知即可立刻从拨测中移除。
              </span>
            </li>
          </ul>

          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Coding%20Plan%20Benchmark%20%E6%8D%90%E8%B5%A0%20Key`}
            className="inline-flex w-full max-w-full items-center gap-3 self-start rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:bg-primary/15 sm:w-auto"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                邮箱联系（唯一捐赠方式）
              </span>
              <span className="truncate font-mono text-sm">{CONTACT_EMAIL}</span>
            </span>
          </a>
          <p className="text-xs text-muted-foreground">
            邮件请注明：想捐赠的平台、希望展示的昵称（或匿名），以及任何使用限制。收到后会尽快回复具体的
            Key 交接方式。
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
