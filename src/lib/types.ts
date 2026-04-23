// 静态快照数据类型 —— 与 Go CLI 导出的 JSON 对齐。

export interface LatestResult {
  provider: string;
  model: string;
  modelDisplay: string;
  avgTtft: number;
  avgTps: number;
  medianTps: number;
  avgLatency: number;
  avgTotalTokens: number;
  hasThinking: boolean;
  abnormalTps: boolean;
  updatedAt?: string;
}

export interface HistoryPoint {
  provider: string;
  model: string;
  modelDisplay: string;
  timePoint: string;
  ttft: number;
  avgTps: number;
  medianTps: number;
}

export interface PerformancePoint {
  seriesKey: string;
  seriesLabel: string;
  timestamp: string;
  timestampUnix: number;
  provider: string;
  tokensPerSec: number;
  medianTps: number;
  ttft: number;
  model?: string;
}

export interface ProviderModel {
  id: string;
  name: string;
  logicalModelId: string;
  apiType?: string;
}

export interface DomesticProviderPolicy {
  permit?: string[];
  deny?: string[];
  [key: string]: unknown;
}

export interface Provider {
  name: string;
  platform: string;
  apiType: string;
  models: ProviderModel[];
  active: boolean;
  purchaseUrl?: string;
  domesticPolicy: DomesticProviderPolicy;
}

export interface DashboardSummary {
  shanghaiDate: string;
  dailyRunIndex: number;
  nextRunAt: string;
}

export interface SnapshotMeta {
  generatedAt: string;
  generatedAtUnix: number;
  activeProviderCount: number;
  activeModelCount: number;
  snapshotCount: number;
}

export interface SnapshotRun {
  key: string;
  file: string;
  runStartedAt: string;
  generatedAt: string;
  totalTasks: number;
  successCount: number;
  errorCount: number;
}

export interface ModelListEntry {
  logicalModelId: string;
  displayName: string;
  providerCount: number;
  providers?: string[];
}

export interface ModelProviderRow {
  provider: string;
  providerPlatform: string;
  avgMedianTps: number;
  avgTps?: number;
  ttftP50: number;
  ttftP95: number;
  successRate: number;
  avgLatency: number;
  sampleCount: number;
  latestProbeAt: string;
}

export interface BenchmarkSnapshot {
  meta: SnapshotMeta;
  summary: DashboardSummary;
  latest: LatestResult[];
  providers: Provider[];
  historyByHours: Record<string, HistoryPoint[]>;
  providerPerformance: PerformancePoint[];
  modelPerformance: PerformancePoint[];
  modelList: ModelListEntry[];
  modelComparisons: Record<string, Record<string, ModelProviderRow[]>>;
  snapshots: SnapshotRun[];
}

// Auth / Comments

export interface AuthUser {
  id: number;
  username: string;
  name?: string;
  displayName?: string;
  avatarTemplate?: string;
  trustLevel: number;
  silenced?: boolean;
  active?: boolean;
  emailConfirmed?: boolean;
}

export interface AuthState {
  loading?: boolean;
  enabled: boolean;
  authenticated: boolean;
  canComment: boolean;
  commentBlockReason?: string;
  loginUrl: string;
  user: AuthUser | null;
}

export interface LevelCountMap {
  all: number;
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  [key: string]: number;
}

export interface CommentRecord {
  id: number;
  threadKey: string;
  parentId?: number | null;
  depth: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  deleted?: boolean;
  author: {
    id: number;
    username: string;
    displayName?: string;
    avatarTemplate?: string;
    trustLevel: number;
  };
  replies?: CommentRecord[];
}

export interface CommentPage {
  threadKey: string;
  page: number;
  pageSize: number;
  totalPages: number;
  totalRootCount: number;
  totalCount: number;
  comments: CommentRecord[];
  levelCounts: LevelCountMap;
}
