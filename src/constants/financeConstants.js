/**
 * Financial Constants for PULSE 30 Simulation Engine
 */

export const MONTHLY_BUDGET_CAP = 10000;
export const TOTAL_SIMULATION_DAYS = 30;

export const HEALTH_TIERS = {
  EXCELLENT: { min: 80, label: 'Apex Sovereign', theme: 'mint' },
  GOOD: { min: 65, label: 'Resilient Buffer', theme: 'cyan' },
  FAIR: { min: 50, label: 'Balanced Edge', theme: 'amber' },
  VULNERABLE: { min: 35, label: 'Tight Burn', theme: 'orange' },
  CRITICAL: { min: 0, label: 'Deficit Alert', theme: 'rose' }
};

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transit / Metro',
  'Social & Nightout',
  'Shopping & Fashion',
  'Education & Books',
  'Health & Wellness',
  'Utilities'
];

export const BUDGET_50_30_20_TARGETS = {
  NEEDS_PERCENT: 50,
  WANTS_PERCENT: 30,
  SAVINGS_PERCENT: 20
};
