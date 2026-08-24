import type { AuditEvent, Transaction } from '@/types';
import { analyzeTransaction, MODEL_VERSION } from './riskEngine';

const customerNames = [
  'Aarav Mehta', 'Diya Sharma', 'Vikram Nair', 'Ananya Iyer', 'Rohan Gupta',
  'Sara Khan', 'Kabir Reddy', 'Ishaan Bose', 'Meera Joshi', 'Arjun Rao',
  'Tara Pillai', 'Nikhil Verma', 'Riya Dutta', 'Sahil Bhat', 'Naina Kaur',
];

const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

let seed = 92800;
function nextId(prefix: string): string {
  seed += rand(1, 3);
  return `${prefix}-${seed}`;
}

function buildTransaction(force?: Partial<Transaction>): Transaction {
  const amount = pick([450, 850, 1200, 2400, 5400, 8999, 12500, 48000, 72000, 999]);
  const accountAge = pick([0, 1, 3, 14, 45, 120, 400]);
  const previousTransactions = accountAge < 7 ? rand(0, 2) : rand(8, 60);
  const paymentAttempts = pick([1, 1, 1, 2, 3, 4, 6]);
  const deviceChanged = Math.random() < 0.28;
  const locationChanged = Math.random() < 0.25;
  const previousRefunds = pick([0, 0, 0, 1, 2, 4, 6]);
  const timeSinceLastTransaction = pick([0.05, 0.5, 2, 8, 24, 72, 200]);
  const historicalRisk = pick([5, 10, 22, 35, 48, 65, 80]);
  const transactionHour = pick([1, 3, 8, 11, 14, 17, 20, 23]);
  const paymentMethod = pick(paymentMethods);
  const customerId = nextId('CUS');
  const id = nextId('TXN');
  const hoursAgo = rand(0, 24 * 7);
  const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();

  const base = {
    id,
    amount,
    currency: 'INR',
    customerId,
    accountAge,
    previousTransactions,
    paymentAttempts,
    deviceChanged,
    locationChanged,
    previousRefunds,
    timeSinceLastTransaction,
    historicalRisk,
    paymentMethod,
    transactionHour,
    status: 'COMPLETED' as const,
    createdAt,
    customerName: pick(customerNames),
  };

  const a = analyzeTransaction(base);
  let status: Transaction['status'] = 'COMPLETED';
  if (a.decision === 'BLOCK') status = 'BLOCKED';
  else if (a.decision === 'REVIEW') status = Math.random() < 0.5 ? 'REVIEWED' : 'PENDING';

  return { ...base, ...a, modelVersion: MODEL_VERSION, status, ...force };
}

let cache: Transaction[] | null = null;

export function getDemoTransactions(count = 48): Transaction[] {
  if (cache) return cache;
  cache = Array.from({ length: count }, () => buildTransaction());
  cache.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return cache;
}

export function getTransactionById(id: string): Transaction | undefined {
  return getDemoTransactions().find((t) => t.id === id);
}

const analysts = ['Ronak Singh', 'System', 'Ronak Singh', 'Priya Anand'];

export function getDemoAuditEvents(): AuditEvent[] {
  const txns = getDemoTransactions();
  return txns.slice(0, 24).map((t, i) => {
    const ts = new Date(+new Date(t.createdAt) + 4 * 1000);
    const analyst = t.decision === 'APPROVE' ? 'System' : pick(analysts);
    const reason =
      t.decision === 'APPROVE'
        ? 'No significant risk signals detected. Auto-approved.'
        : t.decision === 'BLOCK'
        ? 'Risk score exceeded block threshold. Transaction blocked automatically.'
        : 'Multiple risk signals detected. Held for manual review.';
    return {
      id: `AUD-${90000 + i}`,
      timestamp: ts.toISOString(),
      transactionId: t.id,
      modelVersion: t.modelVersion,
      riskScore: t.riskScore,
      decision: t.decision,
      analyst,
      reason,
      action: t.decision === 'APPROVE' ? 'APPROVED' : t.decision === 'BLOCK' ? 'BLOCKED' : 'HELD_FOR_REVIEW',
      recommended: t.decision,
      finalAction: t.decision === 'APPROVE' ? 'APPROVE' : t.decision === 'BLOCK' ? 'BLOCK' : 'REVIEW',
      signals: t.signals,
    };
  });
}

export const demoScenarios: Record<
  'safe' | 'suspicious' | 'high' | 'extreme',
  { label: string; description: string; values: Record<string, string | number | boolean> }
> = {
  safe: {
    label: 'Safe Transaction',
    description: 'Low-risk legitimate customer.',
    values: {
      amount: 1200,
      accountAge: 420,
      previousTransactions: 38,
      paymentAttempts: 1,
      deviceChanged: false,
      locationChanged: false,
      previousRefunds: 0,
      timeSinceLastTransaction: 72,
      historicalRisk: 5,
      transactionHour: 14,
      paymentMethod: 'UPI',
    },
  },
  suspicious: {
    label: 'Suspicious Transaction',
    description: 'Several weak risk signals.',
    values: {
      amount: 5400,
      accountAge: 14,
      previousTransactions: 3,
      paymentAttempts: 2,
      deviceChanged: true,
      locationChanged: false,
      previousRefunds: 1,
      timeSinceLastTransaction: 2,
      historicalRisk: 35,
      transactionHour: 11,
      paymentMethod: 'Credit Card',
    },
  },
  high: {
    label: 'High-Risk Transaction',
    description: 'Strong fraud indicators.',
    values: {
      amount: 8999,
      accountAge: 1,
      previousTransactions: 0,
      paymentAttempts: 4,
      deviceChanged: true,
      locationChanged: true,
      previousRefunds: 2,
      timeSinceLastTransaction: 0.5,
      historicalRisk: 48,
      transactionHour: 23,
      paymentMethod: 'Credit Card',
    },
  },
  extreme: {
    label: 'Extreme Risk',
    description: 'Multiple severe anomalies.',
    values: {
      amount: 72000,
      accountAge: 0,
      previousTransactions: 0,
      paymentAttempts: 6,
      deviceChanged: true,
      locationChanged: true,
      previousRefunds: 6,
      timeSinceLastTransaction: 0.05,
      historicalRisk: 80,
      transactionHour: 2,
      paymentMethod: 'Debit Card',
    },
  },
};
