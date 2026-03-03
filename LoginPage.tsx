import { LoanData } from '@/types/budget';
import { calculateEMI, generateBreakdown } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Calculator } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface EMIBreakdownProps {
  loan: LoanData;
  onNext: () => void;
  onBack: () => void;
}

const COLORS = ['hsl(162, 63%, 41%)', 'hsl(38, 92%, 50%)'];

const EMIBreakdown = ({ loan, onNext, onBack }: EMIBreakdownProps) => {
  const emi = calculateEMI(loan);
  const breakdown = generateBreakdown(loan);

  const totalInterestPaid = breakdown.reduce((s, b) => s + b.interest, 0);
  const totalPrincipalPaid = breakdown.reduce((s, b) => s + b.principal, 0);

  const pieData = [
    { name: 'Principal', value: totalPrincipalPaid },
    { name: 'Interest', value: totalInterestPaid },
  ];

  // Sample every few months for chart readability
  const step = Math.max(1, Math.floor(breakdown.length / 24));
  const chartData = breakdown.filter((_, i) => i % step === 0 || i === breakdown.length - 1);

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-3">
          <Calculator className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-heading font-bold">EMI & Interest Breakdown</h2>
        <p className="text-muted-foreground text-sm">Here's what your loan repayment looks like</p>
      </div>

      {/* EMI Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Monthly EMI</p>
          <p className="text-xl font-heading font-bold text-primary">₹{emi.monthlyEMI.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Total Payable</p>
          <p className="text-xl font-heading font-bold text-foreground">₹{emi.totalPayable.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Total Interest</p>
          <p className="text-xl font-heading font-bold text-accent">₹{emi.totalInterest.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-heading font-semibold mb-3">Interest vs Principal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart - Balance over time */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-heading font-semibold mb-3">Loan Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} label={{ value: 'Month', position: 'bottom', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
              <Area type="monotone" dataKey="balance" stroke="hsl(162, 63%, 41%)" fill="url(#balGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month-wise table (first/last few) */}
      <div className="glass-card rounded-xl p-5 overflow-x-auto">
        <h3 className="text-sm font-heading font-semibold mb-3">Month-wise Breakdown (sample)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 text-left">Month</th>
              <th className="py-2 text-right">EMI</th>
              <th className="py-2 text-right">Interest</th>
              <th className="py-2 text-right">Principal</th>
              <th className="py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.slice(0, 6).map(b => (
              <tr key={b.month} className="border-b border-border/50">
                <td className="py-1.5">{b.month}</td>
                <td className="py-1.5 text-right">₹{b.emi.toLocaleString('en-IN')}</td>
                <td className="py-1.5 text-right text-accent">₹{b.interest.toLocaleString('en-IN')}</td>
                <td className="py-1.5 text-right text-primary">₹{b.principal.toLocaleString('en-IN')}</td>
                <td className="py-1.5 text-right">₹{b.balance.toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {breakdown.length > 6 && (
              <tr><td colSpan={5} className="py-2 text-center text-muted-foreground">... {breakdown.length - 6} more months ...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
          Early Repayment <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EMIBreakdown;
