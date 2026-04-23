export interface CompositeScore {
  composite: number;
  tpsScore: number;
  ttftScore: number;
}

/**
 * 综合评分算法（与旧前端 [frontend/src/App.jsx:312-319] 保持 1:1）：
 *  - TPS 分 = min(100, MedianTPS)，线性计分，100 tok/s 满分
 *  - TTFT 分 = clamp(0, 100, 100 − 25 × log₂(TTFT / 300))，对数递减
 *  - 综合 = TPS 分 × 0.6 + TTFT 分 × 0.4
 */
export function computeCompositeScore(
  medianTps: number | null | undefined,
  ttftMs: number | null | undefined,
): CompositeScore {
  const tps = Number(medianTps) || 0;
  const tpsScore = Math.min(100, Math.max(0, tps));

  let ttftScore = 0;
  if (Number.isFinite(ttftMs as number) && (ttftMs as number) > 0) {
    ttftScore = Math.max(0, Math.min(100, 100 - 25 * Math.log2((ttftMs as number) / 300)));
  }

  return {
    composite: tpsScore * 0.6 + ttftScore * 0.4,
    tpsScore,
    ttftScore,
  };
}
