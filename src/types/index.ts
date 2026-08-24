export type RiskLevel = 'SAFE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Decision = 'APPROVE' | 'REVIEW' | 'BLOCK';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';
export type TxnStatus = 'COMPLETED' | 'PENDING' | 'BLOCKED' | 'REVIEWED' | 'DECLINED';

export interface RiskSignal {
  name: string;
  contribution: number;
  severity: Severity;
  explanation: string;
}

export interface RiskAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  fraudProbability: number;
  decision: Decision;
  confidence: number;
  signals: RiskSignal[];
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  customerId: string;
  accountAge: number; // days
  previousTransactions: number;
  paymentAttempts: number;
  deviceChanged: boolean;
  locationChanged: boolean;
  previousRefunds: number;
  timeSinceLastTransaction: number; // hours
  historicalRisk: number; // 0-100
  paymentMethod: string;
  transactionHour: number; // 0-23
  riskScore: number;
  riskLevel: RiskLevel;
  decision: Decision;
  modelVersion: string;
  status: TxnStatus;
  createdAt: string;
  customerName?: string;
  signals?: RiskSignal[];
  fraudProbability?: number;
}

export interface Thresholds {
  approve: number; // below this -> APPROVE
  review: number; // below this -> REVIEW
  block: number; // at/above this -> BLOCK
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  transactionId: string;
  modelVersion: string;
  riskScore: number;
  decision: Decision;
  analyst: string;
  reason: string;
  action: string;
  features?: Record<string, string | number | boolean>;
  signals?: RiskSignal[];
  recommended?: Decision;
  finalAction?: Decision;
}

export interface ModelMetrics {
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  accuracy: number;
  falsePositiveRate: number;
  truePositive: number;
  trueNegative: number;
  falsePositive: number;
  falseNegative: number;
  total: number;
}

export interface ModelRow {
  name: string;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  latency: number;
  selected?: boolean;
  note?: string;
}
