export const TTFT_CHART_MAX = 4000;
export const IDLE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
export const MAX_REASONABLE_MEDIAN_TPS = 500;
export const MAX_REASONABLE_AVG_TPS = 500;
export const PROVIDER_METRIC_ROTATION_MS = 6000;

export const DOMESTIC_WINDOW_OPTIONS = ['5m', '1h', '6h', '24h', '7d', '30d', '90d'] as const;
export type DomesticWindow = (typeof DOMESTIC_WINDOW_OPTIONS)[number];

export const HISTORY_TIME_RANGES = [24, 72, 168, 720, 2160] as const;
export type HistoryTimeRange = (typeof HISTORY_TIME_RANGES)[number];

export const METRIC_HELP_TEXT = {
  tps: 'MedianTPS 基于相邻 chunk 间隔计算瞬时速度后取中位数；过滤 <50ms 的网络缓冲假间隔并用 IQR 剔除离群值，真实反映持续生成速度。括号中 AvgTPS = totalTokens / effectiveLatency，作为传统参考。',
  ttft: 'TTFT（Time To First Token）= 请求发出到首 token 到达的耗时，越低代表首字响应越快。每轮测试均先预热一次以消除冷启动影响。',
  composite: '综合评分 = TPS分 × 0.6 + TTFT分 × 0.4。TPS分 = min(100, MedianTPS)，线性计分；TTFT分 = clamp(0, 100, 100 − 25 × log₂(TTFT / 300))，对数递减。兼顾生成速度与首字响应。',
} as const;

export const DONATION_EMAIL = 'hloolmz@qq.com';

export const COMMENT_THREAD = 'home';
export const COMMENT_PAGE_SIZE = 5;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_COMMENT_NESTING = 5;
