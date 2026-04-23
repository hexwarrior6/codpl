import { useEffect, useState } from 'react';
import { fetchHistoryData } from '@/lib/data-client';
import type { HistoryTimeRange } from '@/lib/constants';
import type { HistoryPoint } from '@/lib/types';

function resolveDataErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function useHistoryData(range: HistoryTimeRange, enabled = true) {
  const [data, setData] = useState<HistoryPoint[]>([]);
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
      const response = await fetchHistoryData(range, force);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      setData([]);
      setErrorMessage(resolveDataErrorMessage(error, `加载 ${range}h 历史数据失败`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, [enabled, range]);

  return {
    data,
    loading,
    errorMessage,
    reload: () => load(true),
  };
}
