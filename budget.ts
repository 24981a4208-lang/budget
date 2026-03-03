import { AppState, User } from '@/types/budget';

const STORAGE_KEY = 'college_budget_app';

const defaultState: AppState = {
  user: null,
  budget: { monthlyIncome: 0, expenses: [] },
  loan: { principal: 0, annualRate: 0, courseDuration: 0, loanTenure: 0, moratoriumPeriod: 0 },
  earlyRepayment: { extraMonthly: 0, oneTimePrepayment: 0 },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state: Partial<AppState>) {
  const current = loadState();
  const merged = { ...current, ...state };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function loginUser(user: User) {
  saveState({ user });
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return loadState().user !== null;
}
