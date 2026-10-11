export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  tier: 'need' | 'want' | 'commitment';
  day: number;
  type: 'expense' | 'income';
  notes?: string;
}

export interface FixedCommitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  category: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  active: boolean;
  category: string;
  icon?: string;
}

export interface SavingsVault {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
  icon?: string;
}

export interface FinancialState {
  currentDay: number;
  incomes: Array<{ id: string; source: string; amount: number; day: number }>;
  transactions: Transaction[];
  fixedCommitments: FixedCommitment[];
  subscriptions: Subscription[];
  savingsVaults: SavingsVault[];
}
