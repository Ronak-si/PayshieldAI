import type {
  Decision,
  RiskAnalysis,
  RiskLevel,
  RiskSignal,
  Severity,
  Thresholds,
  Transaction,
} from '@/types';

export const DEFAULT_THRESHOLDS: Thresholds = {
  approve: 30,
  review: 70,
  block: 90,
};

export const MODEL_VERSION = 'PayShield Fraud Model v1.0';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function levelFromScore(score: number): RiskLevel {
  const s = clamp(Math.round(score));
  if (s >= 90) return 'CRITICAL';
  if (s >= 70) return 'HIGH';
  if (s >= 30) return 'MEDIUM';
  return 'SAFE';
}

export function decisionFromScore(score: number, t: Thresholds = DEFAULT_THRESHOLDS): Decision {
  const s = clamp(Math.round(score));
  if (s >= t.block) return 'BLOCK';
  if (s >= t.review) return 'REVIEW';
  return 'APPROVE';
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'SAFE':
      return '#10B981';
    case 'MEDIUM':
      return '#F59E0B';
    case 'HIGH':
      return '#F97316';
    case 'CRITICAL':
      return '#EF4444';
  }
}

export function riskGlow(level: RiskLevel): string {
  switch (level) {
    case 'SAFE':
      return 'rgba(16,185,129,0.25)';
    case 'MEDIUM':
      return 'rgba(245,158,11,0.25)';
    case 'HIGH':
      return 'rgba(249,115,22,0.28)';
    case 'CRITICAL':
      return 'rgba(239,68,68,0.32)';
  }
}

export function severityFromContribution(c: number): Severity {
  if (c >= 18) return 'HIGH';
  if (c >= 10) return 'MEDIUM';
  return 'LOW';
}

interface AnalyzeInput {
  amount: number;
  accountAge: number;
  previousTransactions: number;
  paymentAttempts: number;
  deviceChanged: boolean;
  locationChanged: boolean;
  previousRefunds: number;
  timeSinceLastTransaction: number;
  historicalRisk: number;
  transactionHour: number;
  paymentMethod?: string;
}

/**
 * Deterministic, explainable prototype risk engine.
 *
 * Each signal contributes a weighted, capped amount to the final risk score.
 * This is intentionally transparent so the explainability layer can rank
 * and describe every contribution. It is NOT a trained ML model — it is a
 * modular rules engine designed to be swapped for a real model API later.
 */
export function analyzeTransaction(input: AnalyzeInput): RiskAnalysis {
  const signals: RiskSignal[] = [];

  // 1. New customer / account age
  if (input.accountAge < 1) {
    const c = 20;
    signals.push({
      name: 'New Customer',
      contribution: c,
      severity: 'HIGH',
      explanation:
        'The customer account was created today. New accounts have no behavioural history to compare against.',
    });
  } else if (input.accountAge < 7) {
    const c = 14;
    signals.push({
      name: 'New Customer',
      contribution: c,
      severity: 'MEDIUM',
      explanation:
        'The customer account is less than a week old, limiting the behavioural baseline available for verification.',
    });
  } else if (input.accountAge < 30) {
    const c = 8;
    signals.push({
      name: 'Young Account',
      contribution: c,
      severity: 'LOW',
      explanation:
        'The account is under 30 days old. Limited transaction history increases uncertainty.',
    });
  }

  // 2. Multiple payment attempts
  if (input.paymentAttempts >= 5) {
    signals.push({
      name: 'Multiple Payment Attempts',
      contribution: 25,
      severity: 'HIGH',
      explanation: `${input.paymentAttempts} payment attempts occurred within a short period, a strong indicator of card testing or brute-force behaviour.`,
    });
  } else if (input.paymentAttempts >= 3) {
    signals.push({
      name: 'Multiple Payment Attempts',
      contribution: 20,
      severity: 'HIGH',
      explanation: `${input.paymentAttempts} payment attempts were made in a short window, increasing the likelihood of abnormal behaviour.`,
    });
  } else if (input.paymentAttempts === 2) {
    signals.push({
      name: 'Repeated Payment Attempt',
      contribution: 10,
      severity: 'MEDIUM',
      explanation:
        'A second payment attempt was made shortly after the first, which can indicate a retry pattern worth reviewing.',
    });
  }

  // 3. New device
  if (input.deviceChanged) {
    signals.push({
      name: 'New Device',
      contribution: 15,
      severity: 'HIGH',
      explanation:
        'The payment originates from a device not previously associated with this customer.',
    });
  }

  // 4. Unusual transaction amount (relative to customer history)
  const avgAmount = input.previousTransactions > 0 ? 2500 : 0;
  if (input.previousTransactions > 0 && input.amount > avgAmount * 6) {
    signals.push({
      name: 'Unusual Transaction Amount',
      contribution: 20,
      severity: 'HIGH',
      explanation: `The amount (₹${input.amount.toLocaleString('en-IN')}) is far above this customer's typical transaction value.`,
    });
  } else if (input.amount > 50000) {
    signals.push({
      name: 'High Transaction Amount',
      contribution: 17,
      severity: 'HIGH',
      explanation: `The amount (₹${input.amount.toLocaleString('en-IN')}) is unusually high and warrants additional verification.`,
    });
  } else if (input.previousTransactions > 0 && input.amount > avgAmount * 3) {
    signals.push({
      name: 'Unusual Transaction Amount',
      contribution: 12,
      severity: 'MEDIUM',
      explanation: `The amount is several times this customer's average transaction value.`,
    });
  }

  // 5. Location change
  if (input.locationChanged) {
    const c = 11;
    signals.push({
      name: 'Location Anomaly',
      contribution: c,
      severity: 'MEDIUM',
      explanation:
        'The transaction originates from a location or region that differs from the customer usual pattern.',
    });
  }

  // 6. Previous refund behavior
  if (input.previousRefunds >= 4) {
    signals.push({
      name: 'Refund History',
      contribution: 15,
      severity: 'HIGH',
      explanation: `${input.previousRefunds} prior refunds on the account. Elevated refund volume is correlated with dispute and chargeback risk.`,
    });
  } else if (input.previousRefunds >= 2) {
    signals.push({
      name: 'Refund History',
      contribution: 10,
      severity: 'MEDIUM',
      explanation: `${input.previousRefunds} prior refunds on the account suggest a pattern worth monitoring.`,
    });
  } else if (input.previousRefunds === 1) {
    signals.push({
      name: 'Prior Refund',
      contribution: 5,
      severity: 'LOW',
      explanation: 'A single prior refund is present on the account.',
    });
  }

  // 7. Unusual transaction timing
  if (input.transactionHour < 5 || input.transactionHour >= 23) {
    signals.push({
      name: 'Unusual Transaction Timing',
      contribution: 10,
      severity: 'MEDIUM',
      explanation: 'The transaction occurred during an unusual hour (late night / early morning), atypical for normal purchase behaviour.',
    });
  } else if (input.transactionHour < 7) {
    signals.push({
      name: 'Unusual Transaction Timing',
      contribution: 5,
      severity: 'LOW',
      explanation: 'The transaction occurred in the early morning hours, slightly outside typical activity windows.',
    });
  }

  // 8. Rapid re-transaction
  if (input.timeSinceLastTransaction > 0 && input.timeSinceLastTransaction < 0.1) {
    signals.push({
      name: 'Rapid Re-Transaction',
      contribution: 8,
      severity: 'MEDIUM',
      explanation:
        'A new transaction arrived within minutes of the previous one from the same customer.',
    });
  }

  // 9. Historical risk
  if (input.historicalRisk >= 70) {
    signals.push({
      name: 'High Historical Risk',
      contribution: 20,
      severity: 'HIGH',
      explanation: `The customer carries a high historical risk score (${input.historicalRisk}), based on prior flagged activity.`,
    });
  } else if (input.historicalRisk >= 40) {
    signals.push({
      name: 'Elevated Historical Risk',
      contribution: 12,
      severity: 'MEDIUM',
      explanation: `The customer's historical risk score (${input.historicalRisk}) is above the safe baseline.`,
    });
  } else if (input.historicalRisk >= 20) {
    signals.push({
      name: 'Historical Risk',
      contribution: 6,
      severity: 'LOW',
      explanation: `A mild historical risk score (${input.historicalRisk}) is present on the customer profile.`,
    });
  }

  // Sort by contribution descending
  signals.sort((a, b) => b.contribution - a.contribution);

  const rawScore = signals.reduce((sum, s) => sum + s.contribution, 0);
  const riskScore = clamp(Math.round(rawScore));
  const riskLevel = levelFromScore(riskScore);
  const fraudProbability = Number((riskScore / 100).toFixed(2));
  const decision = decisionFromScore(riskScore, DEFAULT_THRESHOLDS);
  const confidence = Number((0.78 + Math.min(riskScore, 100) / 100 * 0.2).toFixed(2));

  return {
    riskScore,
    riskLevel,
    fraudProbability,
    decision,
    confidence,
    signals,
  };
}

/** Attach analysis results to a raw transaction record. */
export function withAnalysis(tx: Omit<Transaction, 'riskScore' | 'riskLevel' | 'decision' | 'modelVersion' | 'signals' | 'fraudProbability'>): Transaction {
  const a = analyzeTransaction(tx);
  return {
    ...tx,
    riskScore: a.riskScore,
    riskLevel: a.riskLevel,
    decision: a.decision,
    fraudProbability: a.fraudProbability,
    signals: a.signals,
    modelVersion: MODEL_VERSION,
  };
}
