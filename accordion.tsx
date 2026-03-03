import { useState, useEffect } from 'react';
import { LoanData } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Landmark } from 'lucide-react';

interface LoanDetailsProps {
  data: LoanData;
  onSave: (data: LoanData) => void;
  onNext: () => void;
  onBack: () => void;
}

const fields = [
  { key: 'principal', label: 'Loan Amount (₹)', hint: 'Total loan you took for education', placeholder: 'e.g. 500000' },
  { key: 'annualRate', label: 'Annual Interest Rate (%)', hint: 'Usually 8-12% for education loans', placeholder: 'e.g. 9.5' },
  { key: 'courseDuration', label: 'Course Duration (years)', hint: 'How long is your degree?', placeholder: 'e.g. 4' },
  { key: 'loanTenure', label: 'Repayment Period (years)', hint: 'Time to pay back after course ends', placeholder: 'e.g. 5' },
  { key: 'moratoriumPeriod', label: 'Moratorium Period (years)', hint: 'Grace period before EMI starts (usually = course duration)', placeholder: 'e.g. 4' },
] as const;

const LoanDetails = ({ data, onSave, onNext, onBack }: LoanDetailsProps) => {
  const [loan, setLoan] = useState<LoanData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { onSave(loan); }, [loan]);

  const update = (key: keyof LoanData, val: number) => {
    setLoan(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (loan.principal <= 0) errs.principal = 'Enter a valid amount';
    if (loan.annualRate <= 0 || loan.annualRate > 30) errs.annualRate = 'Rate should be 0.1-30%';
    if (loan.loanTenure <= 0) errs.loanTenure = 'Enter repayment period';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-3">
          <Landmark className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-heading font-bold">Education Loan Details</h2>
        <p className="text-muted-foreground text-sm">Tell us about your education loan</p>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        {fields.map(({ key, label, hint, placeholder }) => (
          <div key={key} className="space-y-1">
            <Label htmlFor={key} className="text-sm font-semibold">{label}</Label>
            <p className="text-xs text-muted-foreground">{hint}</p>
            <Input
              id={key}
              type="number"
              step={key === 'annualRate' ? '0.1' : '1'}
              placeholder={placeholder}
              value={(loan as any)[key] || ''}
              onChange={(e) => update(key, Number(e.target.value))}
            />
            {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
          Calculate EMI <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LoanDetails;
