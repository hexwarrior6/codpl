import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import snapshotJson from '@/generated/benchmark-data.json';
import { type DomesticWindow, type HistoryTimeRange } from '@/lib/constants';
import { mergeProvidersWithCatalog } from '@/lib/provider-catalog';
import type {
  BenchmarkSnapshot,
  DashboardSummary,
  HistoryPoint,
  LatestResult,
  ModelListEntry,
  ModelProviderRow,
  PerformancePoint,
  Provider,
} from '@/lib/types';

interface BenchmarkDataState {
  latest: LatestResult[];
  history: HistoryPoint[];
  providers: Provider[];
  summary: DashboardSummary;
  providerPerformance: PerformancePoint[];
  modelPerformance: PerformancePoint[];
  modelList: ModelListEntry[];
  modelComparison: ModelProviderRow[];
  comparisonModel: string;
  comparisonWindow: DomesticWindow;
  historyTimeRange: HistoryTimeRange;
  snapshots: BenchmarkSnapshot['snapshots'];
  loading: boolean;
  lastUpdatedAt: Date | null;
  errorMessage: string;
  setHistoryTimeRange: (value: HistoryTimeRange) => void;
  setComparisonModel: (model: string) => void;
  setComparisonWindow: (window: DomesticWindow) => void;
  reload: () => Promise<void>;
}

const emptySummary: DashboardSummary = { shanghaiDate: '', dailyRunIndex: 0, nextRunAt: '' };
const emptySnapshot: BenchmarkSnapshot = {
  meta: {
    generatedAt: '',
    generatedAtUnix: 0,
    activeProviderCount: 0,
    activeModelCount: 0,
    snapshotCount: 0,
  },
  summary: emptySummary,
  latest: [],
  providers: [],
  historyByHours: {},
  providerPerformance: [],
  modelPerformance: [],
  modelList: [],
  modelComparisons: {},
  snapshots: [],
};

const BenchmarkDataContext = createContext<BenchmarkDataState | null>(null);

export function BenchmarkDataProvider({ children }: { children: ReactNode }) {
  const snapshot = useMemo<BenchmarkSnapshot>(() => {
    const raw = (snapshotJson ?? {}) as Partial<BenchmarkSnapshot>;
    const latest = Array.isArray(raw.latest) ? raw.latest : [];
    const providers = mergeProvidersWithCatalog(Array.isArray(raw.providers) ? raw.providers : [], latest);
    return {
      ...emptySnapshot,
      ...raw,
      meta: { ...emptySnapshot.meta, ...(raw.meta ?? {}) },
      summary: { ...emptySummary, ...(raw.summary ?? {}) },
      latest,
      providers,
      historyByHours: raw.historyByHours ?? {},
      providerPerformance: Array.isArray(raw.providerPerformance) ? raw.providerPerformance : [],
      modelPerformance: Array.isArray(raw.modelPerformance) ? raw.modelPerformance : [],
      modelList: Array.isArray(raw.modelList) ? raw.modelList : [],
      modelComparisons: raw.modelComparisons ?? {},
      snapshots: Array.isArray(raw.snapshots) ? raw.snapshots : [],
    };
  }, []);

  const [comparisonModel, setComparisonModel] = useState<string>('');
  const [comparisonWindow, setComparisonWindow] = useState<DomesticWindow>('1h');
  const [historyTimeRange, setHistoryTimeRange] = useState<HistoryTimeRange>(24);
  const history = useMemo<HistoryPoint[]>(
    () => snapshot.historyByHours[String(historyTimeRange)] ?? [],
    [snapshot, historyTimeRange],
  );

  const modelComparison = useMemo<ModelProviderRow[]>(
    () => (comparisonModel ? snapshot.modelComparisons?.[comparisonWindow]?.[comparisonModel] ?? [] : []),
    [snapshot, comparisonModel, comparisonWindow],
  );

  const lastUpdatedAt = useMemo<Date | null>(() => {
    if (!snapshot.meta.generatedAt) return null;
    const parsed = new Date(snapshot.meta.generatedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [snapshot.meta.generatedAt]);

  useEffect(() => {
    if (!comparisonModel && snapshot.modelList.length) {
      const firstMulti = snapshot.modelList.find((m) => m.providerCount >= 2);
      if (firstMulti) {
        setComparisonModel(firstMulti.logicalModelId);
      }
    }
  }, [snapshot.modelList, comparisonModel]);

  const value = useMemo<BenchmarkDataState>(
    () => ({
      latest: snapshot.latest,
      history,
      providers: snapshot.providers,
      summary: snapshot.summary ?? emptySummary,
      providerPerformance: snapshot.providerPerformance,
      modelPerformance: snapshot.modelPerformance,
      modelList: snapshot.modelList,
      modelComparison,
      comparisonModel,
      comparisonWindow,
      historyTimeRange,
      snapshots: snapshot.snapshots,
      loading: false,
      lastUpdatedAt,
      errorMessage: '',
      setHistoryTimeRange,
      setComparisonModel,
      setComparisonWindow,
      reload: async () => {},
    }),
    [
      snapshot,
      history,
      modelComparison,
      comparisonModel,
      comparisonWindow,
      historyTimeRange,
      lastUpdatedAt,
    ],
  );

  return <BenchmarkDataContext.Provider value={value}>{children}</BenchmarkDataContext.Provider>;
}

export function useBenchmarkData(): BenchmarkDataState {
  const ctx = useContext(BenchmarkDataContext);
  if (!ctx) throw new Error('useBenchmarkData 必须在 BenchmarkDataProvider 内使用');
  return ctx;
}
