import { Menu, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ConnectionBadge } from './connection-badge';
import { LayoutModeToggle } from './layout-mode-toggle';
import { SidebarNav } from './sidebar-nav';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/cn';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 gradient-mesh" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border/60 bg-background/60 backdrop-blur-xl lg:flex">
          <SidebarHeader />
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
            <SidebarNav />
            <div className="mt-3 border-t border-border/60 pt-3">
              <a
                href="https://github.com/hloolx/codpl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background/50 text-muted-foreground ring-1 ring-border/60">
                  <GitHubIcon className="h-4 w-4" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">GitHub</span>
                  <span className="truncate text-[11px] text-muted-foreground">hloolx/codpl</span>
                </span>
              </a>
            </div>
          </div>
          <SidebarFooter />
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 py-2.5 backdrop-blur-xl sm:px-4 sm:py-3 lg:hidden">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src="/logo108.png" alt="CPB" className="h-8 w-8 shrink-0 rounded-md" />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold">Coding Plan Benchmark</span>
              <span className="truncate text-[10px] text-muted-foreground">定时静态快照</span>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <LayoutModeToggle compact className="hidden sm:inline-flex" />
            <ThemeToggle compact />
            <Button size="icon" variant="outline" onClick={() => setMobileOpen(true)} aria-label="打开菜单">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-[80%] max-w-sm flex-col bg-background shadow-glow">
              <SidebarHeader onClose={() => setMobileOpen(false)} />
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                <div className="mt-3 border-t border-border/60 pt-3">
                  <a
                    href="https://github.com/hloolx/codpl"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background/50 text-muted-foreground ring-1 ring-border/60">
                      <GitHubIcon className="h-4 w-4" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">GitHub</span>
                      <span className="truncate text-[11px] text-muted-foreground">hloolx/codpl</span>
                    </span>
                  </a>
                </div>
              </div>
              <SidebarFooter />
            </aside>
          </div>
        ) : null}

        <main className="relative flex-1 min-w-0">
          <div className="mx-auto flex w-full flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8 lg:py-10 content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-5 py-5">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo108.png" alt="CPB" className="h-10 w-10 rounded-lg" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Coding Plan Benchmark</span>
          <span className="text-[11px] text-muted-foreground">定时静态快照</span>
        </div>
      </Link>
      {onClose ? (
        <Button size="icon" variant="ghost" className="ml-auto" onClick={onClose} aria-label="关闭">
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className={cn('border-t border-border/60 px-4 py-4 space-y-3')}>
      <ConnectionBadge className="w-full justify-center" />
      <div className="flex items-center justify-between gap-2">
        <ThemeToggle compact />
        <LayoutModeToggle />
      </div>
    </div>
  );
}
