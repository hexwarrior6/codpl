import { normalizeLookupKey } from './model-normalize';
import type { LatestResult, Provider, ProviderModel } from './types';

const DEFAULT_API_TYPE = 'Coding Plan';

interface ProviderCatalogEntry {
  key: string;
  match: string[];
  provider: Provider;
}

function createModels(ids: string[], apiType = DEFAULT_API_TYPE): ProviderModel[] {
  return ids.map((id) => ({
    id,
    name: id,
    logicalModelId: id,
    apiType,
  }));
}

function createProvider(name: string, platform: string, apiType: string, modelIds: string[]): Provider {
  return {
    name,
    platform,
    apiType,
    models: createModels(modelIds, apiType),
    active: false,
    purchaseUrl: '',
    domesticPolicy: {},
  };
}

function normalizeProviderModel(model: Partial<ProviderModel>, fallbackApiType: string): ProviderModel | null {
  const id = `${model.id ?? model.name ?? ''}`.trim();
  if (!id) return null;
  return {
    id,
    name: `${model.name ?? id}`.trim() || id,
    logicalModelId: `${model.logicalModelId ?? id}`.trim() || id,
    apiType: `${model.apiType ?? fallbackApiType}`.trim() || fallbackApiType,
  };
}

function mergeProviderModels(
  primary: ProviderModel[] = [],
  secondary: ProviderModel[] = [],
  fallbackApiType = DEFAULT_API_TYPE,
): ProviderModel[] {
  const merged = new Map<string, ProviderModel>();

  [...primary, ...secondary].forEach((model) => {
    const normalized = normalizeProviderModel(model, fallbackApiType);
    if (!normalized) return;
    const key = normalizeLookupKey(normalized.id);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, normalized);
      return;
    }
    merged.set(key, {
      id: existing.id || normalized.id,
      name: existing.name || normalized.name,
      logicalModelId: existing.logicalModelId || normalized.logicalModelId,
      apiType: existing.apiType || normalized.apiType,
    });
  });

  return Array.from(merged.values());
}

function cloneProvider(provider: Provider): Provider {
  return {
    ...provider,
    models: provider.models.map((model) => ({ ...model })),
    domesticPolicy: { ...provider.domesticPolicy },
  };
}

const PROVIDER_CATALOG_ENTRIES: ProviderCatalogEntry[] = [
  { key: 'xfyun', match: ['讯飞', 'astron', 'spark'], provider: createProvider('讯飞星辰', '讯飞星辰', 'Coding Plan', ['glm-5']) },
  { key: 'bailian', match: ['百炼', '阿里'], provider: createProvider('百炼（阿里云）', '阿里云百炼', 'Coding Plan', ['Qwen3.5 Plus', 'glm-5', 'kimi-k2.5', 'MiniMax-M2.5']) },
  { key: 'kimi', match: ['月之暗面', 'moonshot', 'kimi'], provider: createProvider('Kimi（月之暗面）', '月之暗面 Kimi', 'Coding Plan', ['kimi-k2.6']) },
  { key: 'minimax', match: ['minimax'], provider: createProvider('MiniMax', 'MiniMax', 'Coding Plan', ['minimax-m2.7', 'MiniMax-M2.5']) },
  { key: 'stepfun', match: ['阶跃', 'stepfun'], provider: createProvider('阶跃星辰', '阶跃 StepFun', 'Coding Plan', ['step-3.5-flash']) },
  { key: 'volcengine', match: ['火山', 'volc', '方舟'], provider: createProvider('火山引擎', '火山引擎方舟', 'Coding Plan', ['minimax-m2.5', 'minimax-m2.7', 'glm-5.1', 'deepseek-v3.2', 'kimi-k2.6', 'kimi-k2.5']) },
  { key: 'zhipu', match: ['智谱', 'bigmodel', 'zhipu'], provider: createProvider('智谱', '智谱 GLM', 'Coding Plan', ['glm-5', 'GLM-5-Turbo', 'glm-5.1']) },
  { key: 'infini', match: ['无问', 'infini'], provider: createProvider('无问芯穹', '无问芯穹', 'Coding Plan', ['deepseek-v3.2', 'deepseek-v3.2-thinking', 'glm-4.7', 'minimax-m2.1', 'kimi-k2.5', 'glm-5', 'glm-5.1', 'minimax-m2.5', 'minimax-m2.7']) },
  { key: 'tencent', match: ['腾讯', 'hunyuan', 'lkeap'], provider: createProvider('腾讯云', '腾讯云', 'Coding Plan', ['Hunyuan 2.0 Instruct', 'MiniMax-M2.5', 'kimi-k2.5', 'glm-5']) },
  { key: 'jdcloud', match: ['京东', 'jdcloud'], provider: createProvider('京东云', '京东云', 'Coding Plan', ['DeepSeek-V3.2', 'GLM-5', 'GLM-4.7', 'MiniMax-M2.5', 'Kimi-K2.5']) },
  { key: 'compshare', match: ['优云', 'modelverse', 'compshare'], provider: createProvider('优云（ModelVerse）', '优云 ModelVerse', 'Code API', ['kimi-k2.5', 'MiniMax-M2.5', 'glm-5']) },
  { key: 'cucloud', match: ['联通云', 'cucloud'], provider: createProvider('联通云', '联通云', 'Code API', ['MiniMax-M2.5', 'kimi-k2.5', 'glm-5']) },
  { key: 'yuanjing', match: ['联通元景', '元景', 'yuanjing'], provider: createProvider('联通元景', '联通元景', 'Code API', ['glm-5', 'glm-5.1', 'kimi-k2.6']) },
  { key: 'cmecloud', match: ['移动云', 'cmecloud'], provider: createProvider('移动云', '移动云', 'Coding Plan', ['cm-code-latest']) },
  { key: 'baidu', match: ['百度', '千帆', 'qianfan'], provider: createProvider('百度云（千帆）', '百度智能云千帆', 'Coding Plan', ['deepseek-v3.2', 'kimi-k2.5', 'glm-5', 'minimax-m2.5']) },
  { key: 'mimo', match: ['小米', 'mimo', 'xiaomi'], provider: createProvider('小米 MiMo', '小米 MiMo', 'Coding Plan', ['MiMo-V2.5-Pro', 'MiMo-V2.5']) },
  { key: 'streamlake', match: ['快手', 'streamlake', 'kat-coder'], provider: createProvider('快手 StreamLake', '快手 StreamLake', 'Coding Plan', ['KAT-Coder-ProV2']) },
  { key: 'opencode', match: ['opencode', 'zen go'], provider: createProvider('OpenCode Go', 'OpenCode Go', 'Code API', ['glm-5', 'glm-5.1', 'kimi-k2.5', 'MiMo-V2.5-Pro', 'MiMo-V2.5', 'minimax-m2.7', 'MiniMax-M2.5']) },
  { key: 'ctyun', match: ['天翼', 'ctyun'], provider: createProvider('天翼云', '天翼云', 'Code API', ['GLM-5', 'GLM-5-Turbo', 'GLM-5.1']) },
  { key: 'ollama', match: ['ollama'], provider: createProvider('Ollama Cloud', 'Ollama Cloud', 'Code API', ['deepseek-v3.2', 'glm-4.7', 'glm-5', 'glm-5.1', 'kimi-k2.6', 'kimi-k2.5', 'minimax-m2.1', 'MiniMax-M2.5', 'minimax-m2.7']) },
  { key: 'alaya', match: ['alaya'], provider: createProvider('Alaya Code', 'Alaya Code', 'Code API', ['MiniMax-M2.5', 'minimax-m2.1', 'glm-5', 'kimi-k2.5']) },
];

export const FALLBACK_PROVIDER_CATALOG: Provider[] = PROVIDER_CATALOG_ENTRIES.map((entry) => cloneProvider(entry.provider));

function resolveCatalogProviderKey(providerName = ''): string {
  const normalized = normalizeLookupKey(providerName);
  const matched = PROVIDER_CATALOG_ENTRIES.find((entry) => entry.match.some((keyword) => normalized.includes(keyword)));
  return matched?.key || normalized;
}

export function mergeProvidersWithCatalog(snapshotProviders: Provider[] = [], latestResults: LatestResult[] = []): Provider[] {
  const order: string[] = [];
  const merged = new Map<string, Provider>();
  const measured = new Map<string, { name: string; models: ProviderModel[] }>();

  latestResults.forEach((item) => {
    const providerKey = resolveCatalogProviderKey(item.provider);
    if (!providerKey) return;
    const current = measured.get(providerKey) ?? { name: item.provider, models: [] };
    current.models = mergeProviderModels(
      current.models,
      item.model
        ? [
            {
              id: item.model,
              name: item.modelDisplay || item.model,
              logicalModelId: item.model,
              apiType: DEFAULT_API_TYPE,
            },
          ]
        : [],
      DEFAULT_API_TYPE,
    );
    measured.set(providerKey, current);
  });

  const upsert = (provider: Provider) => {
    const key = resolveCatalogProviderKey(provider.name);
    if (!key) return;
    if (!merged.has(key)) order.push(key);
    merged.set(key, provider);
  };

  PROVIDER_CATALOG_ENTRIES.forEach((entry) => {
    const key = entry.key;
    if (!merged.has(key)) order.push(key);
    merged.set(key, cloneProvider(entry.provider));
  });

  snapshotProviders.forEach((provider) => {
    const key = resolveCatalogProviderKey(provider.name);
    const existing = merged.get(key);
    const apiType = provider.apiType || existing?.apiType || DEFAULT_API_TYPE;
    upsert({
      name: provider.name || existing?.name || measured.get(key)?.name || 'Unknown Provider',
      platform: provider.platform || existing?.platform || provider.name,
      apiType,
      models: mergeProviderModels(existing?.models ?? [], provider.models ?? [], apiType),
      active: Boolean(existing?.active || provider.active || measured.has(key)),
      purchaseUrl: provider.purchaseUrl || existing?.purchaseUrl || '',
      domesticPolicy: { ...(existing?.domesticPolicy ?? {}), ...(provider.domesticPolicy ?? {}) },
    });
  });

  measured.forEach((entry, key) => {
    const existing = merged.get(key);
    if (existing) {
      upsert({
        ...existing,
        active: true,
        models: mergeProviderModels(existing.models, entry.models, existing.apiType || DEFAULT_API_TYPE),
      });
      return;
    }
    upsert({
      name: entry.name,
      platform: entry.name,
      apiType: DEFAULT_API_TYPE,
      models: mergeProviderModels([], entry.models, DEFAULT_API_TYPE),
      active: true,
      purchaseUrl: '',
      domesticPolicy: {},
    });
  });

  return order.map((key) => {
    const provider = merged.get(key)!;
    const apiType = provider.apiType || DEFAULT_API_TYPE;
    return {
      name: provider.name,
      platform: provider.platform || provider.name,
      apiType,
      models: mergeProviderModels(provider.models ?? [], [], apiType),
      active: Boolean(provider.active),
      purchaseUrl: provider.purchaseUrl || '',
      domesticPolicy: { ...(provider.domesticPolicy ?? {}) },
    };
  });
}
