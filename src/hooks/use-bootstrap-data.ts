import { useEffect, useMemo, useState } from 'react';
import { fetchBootstrapData } from '@/lib/data-client';
import type { BootstrapData, DashboardSummary } from '@/lib/types';

const emptySummary: DashboardSummary = { shanghaiDate: '', dailyRunIndex: 0, nextRunAt: '' };

const emptyBootstrap: BootstrapData = {
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
  snapshots: [],
};

function normalizeBootstrap(raw: Partial<BootstrapData> | null | undefined): BootstrapData {
  return {
    ...emptyBootstrap,
    ...(raw ?? {}),
    meta: { ...emptyBootstrap.meta, ...(raw?.meta ?? {}) },
    summary: { ...emptySummary, ...(raw?.summary ?? {}) },
    latest: Array.isArray(raw?.latest) ? raw.latest : [],
    providers: Array.isArray(raw?.providers) ? raw.providers : [],
    snapshots: Array.isArray(raw?.snapshots) ? raw.snapshots : [],
  };
}

function resolveDataErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function useBootstrapData() {
  const [data, setData] = useState<BootstrapData>(emptyBootstrap);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const load = async (force = false) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchBootstrapData(force);
      setData(normalizeBootstrap(response));
    } catch (error) {
      setData(emptyBootstrap);
      setErrorMessage(resolveDataErrorMessage(error, '加载 bootstrap.json 失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, []);

  const lastUpdatedAt = useMemo(() => {
    if (!data.meta.generatedAt) return null;
    const parsed = new Date(data.meta.generatedAt);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [data.meta.generatedAt]);

  return {
    data,
    loading,
    errorMessage,
    lastUpdatedAt,
    reload: () => load(true),
  };
}

