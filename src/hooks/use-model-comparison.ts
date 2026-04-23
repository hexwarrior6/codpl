import { useEffect, useState } from 'react';
import { fetchModelComparisonData, fetchModelListData } from '@/lib/data-client';
import type { DomesticWindow } from '@/lib/constants';
import type { ModelListEntry, ModelProviderRow } from '@/lib/types';

function resolveDataErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function useModelListData(enabled = true) {
  const [data, setData] = useState<ModelListEntry[]>([]);
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
      const response = await fetchModelListData(force);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      setData([]);
      setErrorMessage(resolveDataErrorMessage(error, '加载模型列表失败'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, [enabled]);

  return {
    data,
    loading,
    errorMessage,
    reload: () => load(true),
  };
}

export function useModelComparison(logicalModelId: string, window: DomesticWindow, enabled = true) {
  const [data, setData] = useState<ModelProviderRow[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [errorMessage, setErrorMessage] = useState('');

  const load = async (force = false) => {
    if (!enabled || !logicalModelId) {
      setData([]);
      setLoading(false);
      setErrorMessage('');
      return;
    }

    setLoading(true);
    setData([]);
    setErrorMessage('');

    try {
      const response = await fetchModelComparisonData(window, logicalModelId, force);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      setData([]);
      setErrorMessage(resolveDataErrorMessage(error, `加载模型 ${logicalModelId} 的 ${window} 对比失败`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, [enabled, logicalModelId, window]);

  return {
    data,
    loading,
    errorMessage,
    reload: () => load(true),
  };
}
