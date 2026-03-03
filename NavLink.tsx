import { useState, useEffect } from 'react';
import { LoanData, EarlyRepaymentInput } from '@/types/budget';
import { calculateEMI, compareRepayment } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, TrendingDown, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface EarlyRepaymentProps {
  loan: LoanData;
  earlyRepayment: EarlyRepaymentInput;
  onSave: (data: EarlyRepaymentInput) => void;
  onNext: () => void;
  onBack: () => void;
}

const EarlyRepayment = ({ loan, earlyRepayment, onSave, onNext, onBack }: EarlyRepaymentProps) => {
  const [extra, setExtra] = useState(earlyRepayment);
  const emi = calculateEMI(loan);
  const comparison = compareRepayment(loan, extra);

  useEffect(() => { onSave(extra); }, [extra]);

  const chartData = [
    {
      name: 'Normal',
      Interest: comparison.normal.totalInterest,
      Principal: loan.principal,
    },
    {
      name: 'Early Repayment',
      Interest: comparison.early.totalInterest,
      Principal: loan.principal,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-accent mb-3">
          <TrendingDown className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-heading font-bold">Early Repayment Analysis</h2>
        <p className="text-muted-foreground text-sm">See how paying extra can save you money</p>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="space-y-1">
          <Label className="text-sm font-semibold">Extra Monthly Payment (₹)</Label>
          <p className="text-xs text-muted-foreground">Pay this much extra each month on top of your EMI of ₹{emi.monthlyEMI.toLocaleString('en-IN')}</p>
          <Input
            type="number"
            placeholder="e.g. 2000"
            value={extra.extraMonthly || ''}
            onChange={(e) => setExtra(prev => ({ ...prev, extraMonthly: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-sm font-semibold">One-Time Prepayment (₹)</Label>
          <p className="text-xs text-muted-foreground">A lump sum payment towards your loan principal</p>
          <Input
            type="number"
            placeholder="e.g. 50000"
            value={extra.oneTimePrepayment || ''}
            onChange={(e) => setExtra(prev => ({ ...prev, oneTimePrepayment: Number(e.target.value) }))}
          />
        </div>
      </div>

      {/* Comparison */}
      {(extra.extraMonthly > 0 || extra.oneTimePrepayment > 0) && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="stat-card text-center">
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Interest Saved</p>
              <p className="text-xl font-heading font-bold text-primary">
                ₹{comparison.interestSaved.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="stat-card text-center">
              <TrendingDown className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Months Saved</p>
              <p className="text-xl font-heading font-bold text-primary">
                {comparison.monthsSaved} months
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-heading font-semibold mb-3">Normal vs Early Repayment</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="Principal" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Interest" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-xl p-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-muted-foreground mb-1">Normal Plan</p>
                <p>{comparison.normal.totalMonths} months</p>
                <p>Interest: ₹{comparison.normal.totalInterest.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="font-semibold text-primary mb-1">Early Plan</p>
                <p>{comparison.early.totalMonths} months</p>
                <p>Interest: ₹{comparison.early.totalInterest.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
          View Dashboard <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EarlyRepayment;
