type GiscusMapping = 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
type GiscusInputPosition = 'top' | 'bottom';

function normalizeEnv(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  const normalized = normalizeEnv(value).toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on') return true;
  if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'off') return false;
  return fallback;
}

function parseMapping(value: string): GiscusMapping {
  switch (value) {
    case 'pathname':
    case 'url':
    case 'title':
    case 'og:title':
    case 'specific':
    case 'number':
      return value;
    default:
      return 'pathname';
  }
}

function parseInputPosition(value: string): GiscusInputPosition {
  return value === 'top' ? 'top' : 'bottom';
}

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: GiscusMapping;
  term: string;
  strict: boolean;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: GiscusInputPosition;
  lang: string;
}

export const giscusConfig: GiscusConfig = {
  // Vite build only guarantees static replacement for direct import.meta.env access.
  enabled: parseBoolean(import.meta.env.VITE_GISCUS_ENABLED, true),
  repo: normalizeEnv(import.meta.env.VITE_GISCUS_REPO),
  repoId: normalizeEnv(import.meta.env.VITE_GISCUS_REPO_ID),
  category: normalizeEnv(import.meta.env.VITE_GISCUS_CATEGORY),
  categoryId: normalizeEnv(import.meta.env.VITE_GISCUS_CATEGORY_ID),
  mapping: parseMapping(normalizeEnv(import.meta.env.VITE_GISCUS_MAPPING)),
  term: normalizeEnv(import.meta.env.VITE_GISCUS_TERM),
  strict: parseBoolean(import.meta.env.VITE_GISCUS_STRICT, false),
  reactionsEnabled: parseBoolean(import.meta.env.VITE_GISCUS_REACTIONS_ENABLED, true),
  emitMetadata: parseBoolean(import.meta.env.VITE_GISCUS_EMIT_METADATA, false),
  inputPosition: parseInputPosition(normalizeEnv(import.meta.env.VITE_GISCUS_INPUT_POSITION)),
  lang: normalizeEnv(import.meta.env.VITE_GISCUS_LANG) || 'zh-CN',
};

export function isGiscusConfigured(config: GiscusConfig = giscusConfig): boolean {
  if (!config.enabled) return false;
  if (!config.repo || !config.repoId || !config.category || !config.categoryId) return false;
  if ((config.mapping === 'specific' || config.mapping === 'number') && !config.term) return false;
  return true;
}
