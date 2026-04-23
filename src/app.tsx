import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { BenchmarkDataProvider } from '@/hooks/use-benchmark-data';
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
          <AppShell>
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
          </AppShell>
        </BenchmarkDataProvider>
      </LayoutModeProvider>
    </ThemeProvider>
  );
}
