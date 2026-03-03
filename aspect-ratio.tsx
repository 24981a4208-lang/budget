import { Check } from 'lucide-react';

const STEPS = [
  'Income & Expenses',
  'Loan Details',
  'EMI & Breakdown',
  'Early Repayment',
  'Dashboard',
];

interface StepNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepNavigation = ({ currentStep, onStepClick }: StepNavigationProps) => {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap mb-8">
      {STEPS.map((label, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;

        return (
          <button
            key={label}
            onClick={() => onStepClick(i)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
              ${isActive ? 'step-active' : isCompleted ? 'step-completed' : 'step-inactive'}
            `}
          >
            <span className={`
              w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
              ${isActive ? 'bg-primary-foreground/20' : isCompleted ? 'bg-primary/30' : 'bg-muted-foreground/20'}
            `}>
              {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StepNavigation;
