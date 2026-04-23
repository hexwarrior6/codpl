import { useMemo } from 'react';
import { computeCompositeScore } from '@/lib/scoring';
import { normalizeLookupKey, normalizeModelDisplay } from '@/lib/model-normalize';
import { MAX_REASONABLE_AVG_TPS, MAX_REASONABLE_MEDIAN_TPS } from '@/lib/constants';
import type { LatestResult } from '@/lib/types';

export interface EnrichedResult extends LatestResult {
  normalizedModelDisplay: string;
  compositeScore: number;
  tpsScore: number;
  ttftScore: number;
}

export interface ProviderAverage {
  provider: string;
  model: string;
  modelCount: number;
  averageTps: number;
  averageMedianTps: number;
  averageTtft: number;
  compositeScore: number;
  tpsScore: number;
  ttftScore: number;
  hasThinking: boolean;
  hasAnomaly: boolean;
}

export function useEnrichedResults(latestData: LatestResult[]): EnrichedResult[] {
  return useMemo(
    () =>
      latestData.map((item) => {
        const tps = item.medianTps || item.avgTps || 0;
        const scores = computeCompositeScore(tps, item.avgTtft);
        return {
          ...item,
          normalizedModelDisplay: normalizeModelDisplay(item.model, item.modelDisplay),
          compositeScore: scores.composite,
          tpsScore: scores.tpsScore,
          ttftScore: scores.ttftScore,
        };
      }),
    [latestData],
  );
}

export function useProviderAverages(results: EnrichedResult[]): ProviderAverage[] {
  return useMemo(() => {
    const groups = new Map<string, {
      provider: string;
      model: string;
      tpsSum: number;
      medianTpsSum: number;
      ttftSum: number;
      compositeSum: number;
      tpsScoreSum: number;
      ttftScoreSum: number;
      count: number;
      hasThinking: boolean;
      hasAnomaly: boolean;
    }>();

    results.forEach((item) => {
      const existing = groups.get(item.provider) ?? {
        provider: item.provider,
        model: item.model,
        tpsSum: 0,
        medianTpsSum: 0,
        ttftSum: 0,
        compositeSum: 0,
        tpsScoreSum: 0,
        ttftScoreSum: 0,
        count: 0,
        hasThinking: false,
        hasAnomaly: false,
      };
      existing.tpsSum += Math.min(item.avgTps || 0, MAX_REASONABLE_AVG_TPS);
      existing.medianTpsSum += Math.min(item.medianTps || 0, MAX_REASONABLE_MEDIAN_TPS);
      existing.ttftSum += item.avgTtft || 0;
      existing.compositeSum += item.compositeScore;
      existing.tpsScoreSum += item.tpsScore;
      existing.ttftScoreSum += item.ttftScore;
      existing.count += 1;
      existing.hasThinking = existing.hasThinking || Boolean(item.hasThinking);
      existing.hasAnomaly = existing.hasAnomaly || Boolean(item.abnormalTps);
      groups.set(item.provider, existing);
    });

    return Array.from(groups.values())
      .map((item) => ({
        provider: item.provider,
        model: item.model,
        modelCount: item.count,
        averageTps: item.count ? item.tpsSum / item.count : 0,
        averageMedianTps: item.count ? item.medianTpsSum / item.count : 0,
        averageTtft: item.count ? item.ttftSum / item.count : 0,
        compositeScore: item.count ? item.compositeSum / item.count : 0,
        tpsScore: item.count ? item.tpsScoreSum / item.count : 0,
        ttftScore: item.count ? item.ttftScoreSum / item.count : 0,
        hasThinking: item.hasThinking,
        hasAnomaly: item.hasAnomaly,
      }))
      .sort((a, b) => b.averageMedianTps - a.averageMedianTps);
  }, [results]);
}

export function useUndetectedProviders(
  enrichedResults: EnrichedResult[],
  providers: Array<{ name: string; active: boolean }>,
): string[] {
  return useMemo(() => {
    const measured = new Set(enrichedResults.map((item) => normalizeLookupKey(item.provider)).filter(Boolean));
    return providers
      .filter((item) => !item.active || !measured.has(normalizeLookupKey(item.name)))
      .map((item) => item.name);
  }, [enrichedResults, providers]);
}
