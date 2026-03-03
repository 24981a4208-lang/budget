import { LoanData, EMIResult, MonthBreakdown, EarlyRepaymentInput, RepaymentComparison } from '@/types/budget';

/**
 * Calculate monthly EMI using standard formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly rate, n = tenure in months
 */
export function calculateEMI(loan: LoanData): EMIResult {
  const { principal, annualRate, loanTenure, moratoriumPeriod } = loan;

  // Interest accrued during moratorium
  const monthlyRate = annualRate / 12 / 100;
  const moratoriumMonths = moratoriumPeriod * 12;
  const accruedPrincipal = principal * Math.pow(1 + monthlyRate, moratoriumMonths);

  const tenureMonths = loanTenure * 12;

  if (monthlyRate === 0) {
    const monthlyEMI = accruedPrincipal / tenureMonths;
    return { monthlyEMI, totalPayable: accruedPrincipal, totalInterest: accruedPrincipal - principal };
  }

  const emi =
    (accruedPrincipal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * Generate month-wise breakdown of interest vs principal components.
 */
export function generateBreakdown(loan: LoanData): MonthBreakdown[] {
  const { principal, annualRate, loanTenure, moratoriumPeriod } = loan;
  const monthlyRate = annualRate / 12 / 100;
  const moratoriumMonths = moratoriumPeriod * 12;
  const accruedPrincipal = principal * Math.pow(1 + monthlyRate, moratoriumMonths);
  const tenureMonths = loanTenure * 12;
  const { monthlyEMI } = calculateEMI(loan);

  const breakdown: MonthBreakdown[] = [];
  let balance = accruedPrincipal;

  for (let m = 1; m <= tenureMonths && balance > 0; m++) {
    const interestComponent = Math.round(balance * monthlyRate);
    const principalComponent = Math.min(monthlyEMI - interestComponent, balance);
    balance = Math.max(0, balance - principalComponent);

    breakdown.push({
      month: m,
      emi: monthlyEMI,
      interest: interestComponent,
      principal: Math.round(principalComponent),
      balance: Math.round(balance),
    });
  }

  return breakdown;
}

/**
 * Compare normal repayment with early repayment scenario.
 */
export function compareRepayment(
  loan: LoanData,
  early: EarlyRepaymentInput
): RepaymentComparison {
  const { principal, annualRate, loanTenure, moratoriumPeriod } = loan;
  const monthlyRate = annualRate / 12 / 100;
  const moratoriumMonths = moratoriumPeriod * 12;
  const accruedPrincipal = principal * Math.pow(1 + monthlyRate, moratoriumMonths);
  const { monthlyEMI } = calculateEMI(loan);
  const tenureMonths = loanTenure * 12;

  // Normal
  const normalTotalPayable = monthlyEMI * tenureMonths;
  const normalTotalInterest = normalTotalPayable - principal;

  // Early repayment simulation
  let balance = accruedPrincipal - early.oneTimePrepayment;
  let earlyMonths = 0;
  let earlyTotalInterest = 0;
  const effectiveEMI = monthlyEMI + early.extraMonthly;

  while (balance > 0 && earlyMonths < tenureMonths * 2) {
    earlyMonths++;
    const interest = balance * monthlyRate;
    earlyTotalInterest += interest;
    const principalPaid = Math.min(effectiveEMI - interest, balance);
    balance = Math.max(0, balance - principalPaid);
  }

  return {
    normal: {
      totalMonths: tenureMonths,
      totalInterest: Math.round(normalTotalInterest),
      totalPayable: Math.round(normalTotalPayable),
    },
    early: {
      totalMonths: earlyMonths,
      totalInterest: Math.round(earlyTotalInterest),
      totalPayable: Math.round(principal + earlyTotalInterest + early.oneTimePrepayment),
    },
    interestSaved: Math.round(normalTotalInterest - earlyTotalInterest),
    monthsSaved: tenureMonths - earlyMonths,
  };
}
