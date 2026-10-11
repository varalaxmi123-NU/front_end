import { useMemo } from 'react';
import { calculateFinancialMetrics, generateTrajectoryData } from '../utils/financeEngine';

/**
 * Custom hook wrapping financial calculations and trajectory forecasting
 * @param {Object} financialState 
 */
export function useFinancialEngine(financialState) {
  const metrics = useMemo(() => {
    return calculateFinancialMetrics(financialState);
  }, [financialState]);

  const trajectoryPoints = useMemo(() => {
    return generateTrajectoryData(financialState);
  }, [financialState]);

  return {
    metrics,
    trajectoryPoints
  };
}
