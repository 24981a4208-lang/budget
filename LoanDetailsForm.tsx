import { BudgetData, LoanData, EarlyRepaymentInput } from '@/types/budget';
import { calculateEMI, compareRepayment } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Wallet, Landmark, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  budget: BudgetData;
  loan: LoanData;
  earlyRepayment: EarlyRepaymentInput;
}

const PIE_COLORS = ['hsl(162, 63%, 41%)', 'hsl(38, 92%, 50%)', 'hsl(210, 80%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(280, 60%, 55%)'];

const DashboardView = ({ budget, loan, earlyRepayment }: DashboardViewProps) => {
  const emi = calculateEMI(loan);
  const comparison = compareRepayment(loan, earlyRepayment);
  const totalExpenses = budget.expenses.reduce((s, e) => s + e.amount, 0);
  const surplus = budget.monthlyIncome - totalExpenses;
  const emiToIncomeRatio = budget.monthlyIncome > 0 ? (emi.monthlyEMI / budget.monthlyIncome) * 100 : 0;
  const loanProgress = loan.principal > 0 ? ((emi.totalPayable - loan.principal) / emi.totalPayable) * 100 : 0;

  const expenseData = budget.expenses.filter(e => e.amount > 0).map(e => ({ name: e.category, value: e.amount }));

  const incomeVsExpense = [
    { name: 'Income', amount: budget.monthlyIncome },
    { name: 'Expenses', amount: totalExpenses },
    { name: 'EMI', amount: emi.monthlyEMI },
  ];

  // Alerts
  const alerts: { type: 'warning' | 'danger' | 'success'; icon: any; message: string }[] = [];

  if (totalExpenses > budget.monthlyIncome) {
    alerts.push({ type: 'danger', icon: AlertTriangle, message: `😬 You're spending ₹${(totalExpenses - budget.monthlyIncome).toLocaleString('en-IN')} more than you earn! Time to cut back — maybe skip that extra chai? ☕` });
  }
  if (emiToIncomeRatio > 40) {
    alerts.push({ type: 'danger', icon: AlertTriangle, message: `😰 Your EMI eats up ${emiToIncomeRatio.toFixed(0)}% of your income — that's way too heavy! Try to keep it under 40% so you can still breathe.` });
  } else if (emiToIncomeRatio > 30) {
    alerts.push({ type: 'warning', icon: Info, message: `⚠️ Your EMI is ${emiToIncomeRatio.toFixed(0)}% of your income. It's manageable for now, but don't let other expenses pile up!` });
  }
  if (surplus > emi.monthlyEMI * 0.2 && surplus > 0) {
    alerts.push({ type: 'success', icon: Sparkles, message: `💡 You have ₹${surplus.toLocaleString('en-IN')} left over each month. Pay a little extra towards your loan — even small amounts can save you lakhs in interest! 🎯` });
  }
  if (comparison.interestSaved > 0) {
    alerts.push({ type: 'success', icon: CheckCircle, message: `🎉 With early repayment, you save ₹${comparison.interestSaved.toLocaleString('en-IN')} in interest and finish ${comparison.monthsSaved} months sooner! That's real money back in your pocket.` });
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-xl font-heading font-bold">Your Financial Dashboard</h2>
        <p className="text-muted-foreground text-sm">Complete overview of your budget and loan</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              a.type === 'danger' ? 'alert-danger' : a.type === 'warning' ? 'alert-warning' : 'alert-success'
            }`}>
              <a.icon className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-card">
          <Wallet className="w-5 h-5 text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Monthly Income</p>
          <p className="text-lg font-heading font-bold">₹{budget.monthlyIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <TrendingUp className="w-5 h-5 text-destructive mb-2" />
          <p className="text-xs text-muted-foreground">Monthly Expenses</p>
          <p className="text-lg font-heading font-bold">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <Landmark className="w-5 h-5 text-accent mb-2" />
          <p className="text-xs text-muted-foreground">Monthly EMI</p>
          <p className="text-lg font-heading font-bold">₹{emi.monthlyEMI.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card">
          <Sparkles className="w-5 h-5 text-info mb-2" />
          <p className="text-xs text-muted-foreground">Interest Saved</p>
          <p className="text-lg font-heading font-bold text-primary">₹{comparison.interestSaved.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Loan Progress */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-heading font-semibold">Total Interest vs Principal</h3>
          <span className="text-xs text-muted-foreground">
            Interest: ₹{emi.totalInterest.toLocaleString('en-IN')} of ₹{emi.totalPayable.toLocaleString('en-IN')}
          </span>
        </div>
        <Progress value={100 - loanProgress} className="h-3" />
        <p className="text-xs text-muted-foreground mt-1">
          {(100 - loanProgress).toFixed(0)}% goes to principal, {loanProgress.toFixed(0)}% goes to interest
        </p>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-heading font-semibold mb-3">Income vs Expenses vs EMI</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={incomeVsExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                <Cell fill="hsl(162, 63%, 41%)" />
                <Cell fill="hsl(0, 72%, 51%)" />
                <Cell fill="hsl(38, 92%, 50%)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-heading font-semibold mb-3">Expense Breakdown</h3>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-16">No expenses added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
