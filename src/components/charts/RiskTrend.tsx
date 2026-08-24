import {
  AreaChart,
  Area,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const tooltipStyle = {
  background: '#0B1026',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  fontSize: 12,
};

interface Point {
  day: string;
  total: number;
  high: number;
  blocked: number;
}

export function RiskTrendChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A82F5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#1A82F5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Transactions"
            stroke="#1A82F5"
            strokeWidth={2}
            fill="url(#gTotal)"
          />
          <Area
            type="monotone"
            dataKey="high"
            name="High-Risk"
            stroke="#F97316"
            strokeWidth={2}
            fill="url(#gHigh)"
          />
          <Line
            type="monotone"
            dataKey="blocked"
            name="Blocked"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function buildTrendData(transactions: { createdAt: string; riskScore: number; decision: string }[]) {
  const days: Point[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push({ day: label, total: 0, high: 0, blocked: 0 });
  }
  const dayLabels = days.map((d) => d.day);
  transactions.forEach((t) => {
    const d = new Date(t.createdAt);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const idx = dayLabels.indexOf(label);
    if (idx >= 0) {
      days[idx].total++;
      if (t.riskScore >= 70) days[idx].high++;
      if (t.decision === 'BLOCK') days[idx].blocked++;
    }
  });
  return days;
}
