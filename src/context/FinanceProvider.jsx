import React, { useState, useMemo } from 'react';
import { FinanceContext } from './FinanceContext';
import { INITIAL_FINANCIAL_STATE } from '../data/initialData';
import { calculateFinancialMetrics, generateTrajectoryData } from '../utils/financeEngine';

export function FinanceProvider({ children }) {
  const [financialState, setFinancialState] = useState(INITIAL_FINANCIAL_STATE);
  const [activeSimulation, setActiveSimulation] = useState(null);

  const metrics = useMemo(() => {
    return calculateFinancialMetrics(financialState);
  }, [financialState]);

  const trajectoryPoints = useMemo(() => {
    return generateTrajectoryData(financialState);
  }, [financialState]);

  const value = {
    financialState,
    setFinancialState,
    metrics,
    trajectoryPoints,
    activeSimulation,
    setActiveSimulation
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}
