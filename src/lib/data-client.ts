import type { DomesticWindow, HistoryTimeRange } from '@/lib/constants';
import type {
  BootstrapData,
  HistoryPoint,
  ModelListEntry,
  ModelProviderRow,
  PerformancePoint,
  PerformanceRangeKey,
} from '@/lib/types';

type JsonValue = BootstrapData | HistoryPoint[] | PerformancePoint[] | ModelListEntry[] | ModelProviderRow[];

const DATA_ROOT = '/data';
const requestCache = new Map<string, Promise<JsonValue>>();

async function fetchJson<T extends JsonValue>(path: string, force = false): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (force) {
    requestCache.delete(normalizedPath);
  }

  const cached = requestCache.get(normalizedPath) as Promise<T> | undefined;
  if (cached) {
    return cached;
  }

  const request = (async () => {
    const response = await fetch(normalizedPath, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`请求 ${normalizedPath} 失败（HTTP ${response.status}）`);
    }

    return (await response.json()) as T;
  })();

  requestCache.set(normalizedPath, request as Promise<JsonValue>);

  try {
    return await request;
  } catch (error) {
    requestCache.delete(normalizedPath);
    throw error;
  }
}

export function invalidateDataCache(path?: string) {
  if (!path) {
    requestCache.clear();
    return;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  requestCache.delete(normalizedPath);
}

export function fetchBootstrapData(force = false) {
  return fetchJson<BootstrapData>(`${DATA_ROOT}/bootstrap.json`, force);
}

export function fetchHistoryData(range: HistoryTimeRange, force = false) {
  return fetchJson<HistoryPoint[]>(`${DATA_ROOT}/history/${range}.json`, force);
}

export function fetchPerformanceData(kind: 'provider' | 'model', range: PerformanceRangeKey, force = false) {
  return fetchJson<PerformancePoint[]>(`${DATA_ROOT}/performance/${kind}-${range}.json`, force);
}

export function fetchModelListData(force = false) {
  return fetchJson<ModelListEntry[]>(`${DATA_ROOT}/models/list.json`, force);
}

export function fetchModelComparisonData(window: DomesticWindow, logicalModelId: string, force = false) {
  return fetchJson<ModelProviderRow[]>(
    `${DATA_ROOT}/comparisons/${window}/${encodeURIComponent(logicalModelId)}.json`,
    force,
  );
}

