import { useState, useEffect } from 'react';
import { BudgetData, Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowRight, Wallet } from 'lucide-react';

interface IncomeExpensesProps {
  data: BudgetData;
  onSave: (data: BudgetData) => void;
  onNext: () => void;
}

const IncomeExpenses = ({ data, onSave, onNext }: IncomeExpensesProps) => {
  const [income, setIncome] = useState(data.monthlyIncome || 0);
  const [expenses, setExpenses] = useState<Expense[]>(
    data.expenses.length > 0 ? data.expenses : EXPENSE_CATEGORIES.map(c => ({ category: c, amount: 0 }))
  );

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const surplus = income - totalExpenses;

  useEffect(() => {
    onSave({ monthlyIncome: income, expenses });
  }, [income, expenses]);

  const updateExpense = (index: number, amount: number) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], amount };
    setExpenses(updated);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-3">
          <Wallet className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-heading font-bold">Your Monthly Budget</h2>
        <p className="text-muted-foreground text-sm">How much do you earn and spend each month?</p>
      </div>

      {/* Income */}
      <div className="glass-card rounded-xl p-5">
        <Label htmlFor="income" className="text-sm font-semibold">Monthly Income (₹)</Label>
        <p className="text-xs text-muted-foreground mb-2">Include pocket money, part-time jobs, stipends, etc.</p>
        <Input
          id="income"
          type="number"
          placeholder="e.g. 15000"
          value={income || ''}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="text-lg font-semibold"
        />
      </div>

      {/* Expenses */}
      <div className="glass-card rounded-xl p-5">
        <Label className="text-sm font-semibold mb-3 block">Monthly Expenses (₹)</Label>
        <div className="space-y-3">
          {expenses.map((exp, i) => (
            <div key={exp.category} className="flex items-center gap-3">
              <span className="text-sm w-28 shrink-0 text-muted-foreground">{exp.category}</span>
              <Input
                type="number"
                placeholder="0"
                value={exp.amount || ''}
                onChange={(e) => updateExpense(i, Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="text-lg font-heading font-bold text-primary">₹{income.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="text-lg font-heading font-bold text-destructive">₹{totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-xs text-muted-foreground">Surplus</p>
          <p className={`text-lg font-heading font-bold ${surplus >= 0 ? 'text-primary' : 'text-destructive'}`}>
            ₹{surplus.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <Button onClick={onNext} className="w-full gradient-primary text-primary-foreground hover:opacity-90">
        Continue to Loan Details <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
};

export default IncomeExpenses;
