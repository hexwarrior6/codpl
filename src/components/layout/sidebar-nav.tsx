import { BarChart3, GaugeCircle, LayoutDashboard, LineChart, MessageSquare, ScrollText, Server, Heart } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: typeof BarChart3;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '概览', description: '核心指标 + 综合排行', icon: LayoutDashboard, end: true },
  { to: '/leaderboards', label: '排行榜', description: '综合 / TPS / TTFT', icon: GaugeCircle },
  { to: '/compare', label: '模型对比', description: '同模型多厂家对照', icon: BarChart3 },
  { to: '/trends', label: '趋势', description: '24h 到 365d 分片趋势', icon: LineChart },
  { to: '/providers', label: '厂商', description: '接入状态 + 入口', icon: Server },
  { to: '/community', label: '社区', description: '静态站点讨论说明', icon: MessageSquare },
  { to: '/methodology', label: '方法论', description: '指标与口径说明', icon: ScrollText },
  { to: '/donate', label: '捐赠', description: '支持站点持续运营', icon: Heart },
];

export function SidebarNav({ onNavigate, orientation = 'vertical' }: { onNavigate?: () => void; orientation?: 'vertical' | 'horizontal' }) {
  const isVertical = orientation === 'vertical';
  return (
    <nav className={cn('flex w-full', isVertical ? 'flex-col gap-1' : 'flex-row gap-1 overflow-x-auto')}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isVertical ? 'w-full' : 'flex-shrink-0',
                isActive
                  ? 'bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.18)]'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md bg-background/50 text-muted-foreground ring-1 ring-border/60 transition-colors',
                    isActive && 'bg-primary/15 text-primary ring-primary/30',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-foreground/90 group-hover:text-foreground">{item.label}</span>
                  {isVertical ? (
                    <span className="truncate text-[11px] text-muted-foreground">{item.description}</span>
                  ) : null}
                </span>
                {isActive && isVertical ? (
                  <span className="absolute right-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary" aria-hidden="true" />
                ) : null}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
