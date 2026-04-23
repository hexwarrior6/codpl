import { useEffect, useState } from 'react';
import { fetchPerformanceData } from '@/lib/data-client';
import type { PerformancePoint, PerformanceRangeKey } from '@/lib/types';

function resolveDataErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function usePerformanceData(
  kind: 'provider' | 'model',
  range: PerformanceRangeKey,
  enabled = true,
) {
  const [data, setData] = useState<PerformancePoint[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState('');

  const load = async (force = false) => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setData([]);
    setErrorMessage('');

    try {
      const response = await fetchPerformanceData(kind, range, force);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      setData([]);
      setErrorMessage(resolveDataErrorMessage(error, `加载 ${kind}-${range} 长期趋势失败`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, [enabled, kind, range]);

  return {
    data,
    loading,
    errorMessage,
    reload: () => load(true),
  };
}
