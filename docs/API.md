# Domain API & Function Reference

## `financialCalculationService`

### `computeMetrics(state: FinancialState): FinancialMetrics`
Calculates real-time financial health, daily safe allowance, and pillar resilience scores.

### `simulateDecision(currentState: FinancialState, action: SimulationAction): SimulationResult`
Performs what-if mathematical projection of actions (PURCHASE, SUBSCRIPTION_TOGGLE, GIG_INCOME, VAULT_TRANSFER, SPENDING_CUT).

## `storageService`
- `loadState(fallback: FinancialState): FinancialState`: Safely loads cached state from localStorage.
- `saveState(state: FinancialState): void`: Serializes current state to localStorage.
- `clearState(): void`: Resets state cache.

## `exportService`
- `exportToJSON(data: any, filename?: string): boolean`: Downloads data as formatted JSON.
- `exportToCSV(transactions: Transaction[], filename?: string): boolean`: Downloads transactions as CSV table.
