import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useBootstrapData } from '@/hooks/use-bootstrap-data';
import { type DomesticWindow, type HistoryTimeRange } from '@/lib/constants';
import type { DashboardSummary, LatestResult, Provider, SnapshotRun } from '@/lib/types';

interface BenchmarkDataState {
  latest: LatestResult[];
  providers: Provider[];
  summary: DashboardSummary;
  comparisonModel: string;
  comparisonWindow: DomesticWindow;
  historyTimeRange: HistoryTimeRange;
  snapshots: SnapshotRun[];
  loading: boolean;
  lastUpdatedAt: Date | null;
  errorMessage: string;
  setHistoryTimeRange: (value: HistoryTimeRange) => void;
  setComparisonModel: (model: string) => void;
  setComparisonWindow: (window: DomesticWindow) => void;
  reload: () => Promise<void>;
}

const BenchmarkDataContext = createContext<BenchmarkDataState | null>(null);

export function BenchmarkDataProvider({ children }: { children: ReactNode }) {
  const { data, loading, errorMessage, lastUpdatedAt, reload } = useBootstrapData();
  const [comparisonModel, setComparisonModel] = useState<string>('');
  const [comparisonWindow, setComparisonWindow] = useState<DomesticWindow>('1h');
  const [historyTimeRange, setHistoryTimeRange] = useState<HistoryTimeRange>(24);

  const value = useMemo<BenchmarkDataState>(
    () => ({
      latest: data.latest,
      providers: data.providers,
      summary: data.summary,
      comparisonModel,
      comparisonWindow,
      historyTimeRange,
      snapshots: data.snapshots,
      loading,
      lastUpdatedAt,
      errorMessage,
      setHistoryTimeRange,
      setComparisonModel,
      setComparisonWindow,
      reload,
    }),
    [
      comparisonModel,
      comparisonWindow,
      data.latest,
      data.providers,
      data.snapshots,
      data.summary,
      errorMessage,
      historyTimeRange,
      lastUpdatedAt,
      loading,
      reload,
    ],
  );

  return <BenchmarkDataContext.Provider value={value}>{children}</BenchmarkDataContext.Provider>;
}

export function useBenchmarkData(): BenchmarkDataState {
  const ctx = useContext(BenchmarkDataContext);
  if (!ctx) throw new Error('useBenchmarkData 必须在 BenchmarkDataProvider 内使用');
  return ctx;
}

