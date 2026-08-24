import { create } from './tinyStore';
import type { AuditEvent, Thresholds, Transaction } from '@/types';
import { DEFAULT_THRESHOLDS, MODEL_VERSION } from './riskEngine';
import { getDemoAuditEvents, getDemoTransactions } from './demoData';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
}

export interface Settings {
  thresholds: Thresholds;
  notifications: {
    highRisk: boolean;
    model: boolean;
    system: boolean;
  };
  appearance: 'dark' | 'light';
  demoMode: boolean;
}

interface AppState {
  transactions: Transaction[];
  audit: AuditEvent[];
  toasts: Toast[];
  settings: Settings;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  addAudit: (e: AuditEvent) => void;
  setDecision: (id: string, decision: Transaction['decision'], analyst: string, reason: string) => void;
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setThresholds: (t: Thresholds) => void;
  toggleDemoMode: () => void;
}

let toastSeq = 0;

export const useStore = create<AppState>((set, get) => ({
  transactions: getDemoTransactions(),
  audit: getDemoAuditEvents(),
  toasts: [],
  settings: {
    thresholds: DEFAULT_THRESHOLDS,
    notifications: { highRisk: true, model: true, system: true },
    appearance: 'dark',
    demoMode: false,
  },
  addTransaction: (t) =>
    set((s) => ({ transactions: [t, ...s.transactions].slice(0, 200) })),
  updateTransaction: (id, patch) =>
    set((s) => ({
      transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  addAudit: (e) => set((s) => ({ audit: [e, ...s.audit].slice(0, 100) })),
  setDecision: (id, decision, analyst, reason) => {
    const txn = get().transactions.find((t) => t.id === id);
    if (!txn) return;
    const status: Transaction['status'] =
      decision === 'APPROVE' ? 'COMPLETED' : decision === 'BLOCK' ? 'BLOCKED' : 'REVIEWED';
    get().updateTransaction(id, { decision, status });
    const evt: AuditEvent = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      transactionId: id,
      modelVersion: MODEL_VERSION,
      riskScore: txn.riskScore,
      decision,
      analyst,
      reason,
      action: decision === 'APPROVE' ? 'APPROVED' : decision === 'BLOCK' ? 'BLOCKED' : 'HELD_FOR_REVIEW',
      recommended: txn.decision,
      finalAction: decision,
      signals: txn.signals,
    };
    get().addAudit(evt);
    get().pushToast({
      variant: decision === 'BLOCK' ? 'warning' : 'success',
      title: `Decision recorded: ${decision}`,
      description: `${id} marked ${status.toLowerCase()}.`,
    });
  },
  pushToast: (t) => {
    const id = `t-${++toastSeq}`;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => get().dismissToast(id), 4200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  setThresholds: (t) => set((s) => ({ settings: { ...s.settings, thresholds: t } })),
  toggleDemoMode: () => set((s) => ({ settings: { ...s.settings, demoMode: !s.settings.demoMode } })),
}));
