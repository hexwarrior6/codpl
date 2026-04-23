import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { BenchmarkDataProvider, useBenchmarkData } from '@/hooks/use-benchmark-data';
import { ThemeProvider } from '@/hooks/use-theme';
import { LayoutModeProvider } from '@/hooks/use-layout-mode';
import { OverviewRoute } from '@/routes/overview';
import { LeaderboardsRoute } from '@/routes/leaderboards';
import { TrendsRoute } from '@/routes/trends';
import { ComparisonRoute } from '@/routes/comparison';
import { ProvidersRoute } from '@/routes/providers';
import { CommunityRoute } from '@/routes/community';
import { MethodologyRoute } from '@/routes/methodology';
import { DonateRoute } from '@/routes/donate';
import { NotFoundRoute } from '@/routes/not-found';

export default function App() {
  return (
    <ThemeProvider>
      <LayoutModeProvider>
        <BenchmarkDataProvider>
          <AppContent />
        </BenchmarkDataProvider>
      </LayoutModeProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { errorMessage, loading, reload } = useBenchmarkData();

  return (
    <AppShell>
      {errorMessage && !loading ? (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">站点基础数据加载失败</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <code>bootstrap.json</code> 没有成功加载，所以首页、排行榜和厂商列表都无法继续展示。请先确认{' '}
              <code>/data/bootstrap.json</code> 已成功导出并可被静态站访问。
            </p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-background/60 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
          <button
            type="button"
            onClick={() => {
              void reload();
            }}
            className="inline-flex w-fit items-center rounded-md border border-border/60 bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            重新加载
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<OverviewRoute />} />
          <Route path="/leaderboards" element={<LeaderboardsRoute />} />
          <Route path="/compare" element={<ComparisonRoute />} />
          <Route path="/trends" element={<TrendsRoute />} />
          <Route path="/providers" element={<ProvidersRoute />} />
          <Route path="/community" element={<CommunityRoute />} />
          <Route path="/methodology" element={<MethodologyRoute />} />
          <Route path="/donate" element={<DonateRoute />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      )}
    </AppShell>
  );
}
