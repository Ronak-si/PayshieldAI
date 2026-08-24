import type { ModelMetrics, ModelRow } from '@/types';

// Illustrative benchmark values for a prototype/demo model.
// These are NOT measured from a trained model — they are demo benchmarks
// structured so real held-out test-set metrics can replace them later.
export const DEMO_METRICS: ModelMetrics = {
  precision: 0.914,
  recall: 0.887,
  f1: 0.9003,
  rocAuc: 0.942,
  accuracy: 0.926,
  falsePositiveRate: 0.062,
  truePositive: 887,
  trueNegative: 18210,
  falsePositive: 1198,
  falseNegative: 113,
  total: 20408,
};

export const MODEL_COMPARISON: ModelRow[] = [
  {
    name: 'Logistic Regression',
    precision: 0.842,
    recall: 0.798,
    f1: 0.819,
    rocAuc: 0.871,
    latency: 38,
    note: 'Fast, interpretable baseline. Underfits weak-signal combinations.',
  },
  {
    name: 'Random Forest',
    precision: 0.881,
    recall: 0.842,
    f1: 0.861,
    rocAuc: 0.906,
    latency: 96,
    note: 'Handles non-linear signal interactions well. Less calibrated.',
  },
  {
    name: 'Gradient Boosting',
    precision: 0.902,
    recall: 0.871,
    f1: 0.886,
    rocAuc: 0.931,
    latency: 112,
    note: 'Strong performer. Good precision/recall balance.',
  },
  {
    name: 'PayShield Fraud Model v1.0',
    precision: 0.914,
    recall: 0.887,
    f1: 0.9,
    rocAuc: 0.942,
    latency: 142,
    selected: true,
    note: 'Selected model. Calibrated gradient boosting with explainability layer.',
  },
];

export interface ThresholdPoint {
  threshold: number;
  precision: number;
  recall: number;
  falsePositives: number;
  falseNegatives: number;
  estimatedLoss: number;
  customerFriction: number;
}

/**
 * Simulate precision/recall/FN/FP as the decision threshold moves.
 *
 * This is a synthetic but principled trade-off curve: as the threshold rises,
 * recall falls (we miss more fraud) and precision rises (we flag fewer
 * legitimate transactions). It mirrors the shape of a real PR curve and is
 * intended for demonstrating the trade-off, not claiming measured results.
 */
export function simulateThreshold(
  threshold: number,
  opts: { avgLegitValue: number; avgFraudLoss: number },
): ThresholdPoint {
  const t = threshold / 100;
  // recall falls as threshold rises
  const recall = clamp(0.95 - 0.62 * t);
  // precision rises then plateaus
  const precision = clamp(0.55 + 0.42 * t - 0.06 * t * t);
  // base population
  const legit = 18000;
  const fraud = 800;
  const falseNegatives = Math.round(fraud * (1 - recall));
  const falsePositives = Math.round(legit * (1 - precision) * 0.12);
  const estimatedLoss = Math.round(
    falseNegatives * opts.avgFraudLoss + falsePositives * opts.avgLegitValue * 0.04,
  );
  // friction rises with threshold (more legit users held for review)
  const customerFriction = Math.round(t * 100);
  return {
    threshold,
    precision: Number(precision.toFixed(3)),
    recall: Number(recall.toFixed(3)),
    falsePositives,
    falseNegatives,
    estimatedLoss,
    customerFriction,
  };
}

export function thresholdSeries(
  opts: { avgLegitValue: number; avgFraudLoss: number },
  step = 5,
): ThresholdPoint[] {
  const out: ThresholdPoint[] = [];
  for (let th = 0; th <= 100; th += step) {
    out.push(simulateThreshold(th, opts));
  }
  return out;
}

function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n));
}

export function costOfBeingWrong(opts: {
  avgLegitValue: number;
  fpRate: number;
  avgFraudLoss: number;
  fnRate: number;
  legitVolume: number;
  fraudVolume: number;
}): { fpCost: number; fnCost: number } {
  const fp = Math.round(opts.legitVolume * opts.fpRate);
  const fn = Math.round(opts.fraudVolume * opts.fnRate);
  // FP cost: lost customer friction + operational review cost (~4% of tx value)
  const fpCost = Math.round(fp * opts.avgLegitValue * 0.04);
  // FN cost: full fraud loss
  const fnCost = Math.round(fn * opts.avgFraudLoss);
  return { fpCost, fnCost };
}
