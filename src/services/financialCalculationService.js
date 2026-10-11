import { calculateFinancialMetrics, simulateDecision, generateTrajectoryData } from '../utils/financeEngine';

/**
 * Domain Service for Financial Modeling and Simulation
 */
export const financialCalculationService = {
  computeMetrics: (state) => calculateFinancialMetrics(state),
  simulate: (state, action) => simulateDecision(state, action),
  generateTrajectory: (state) => generateTrajectoryData(state),
  
  calculateDailyAllowance: (liquidBalance, upcomingObligations, remainingDays) => {
    const netPool = Math.max(0, liquidBalance - upcomingObligations);
    const days = Math.max(1, remainingDays);
    return Math.round(netPool / days);
  }
};
