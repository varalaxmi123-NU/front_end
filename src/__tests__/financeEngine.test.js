import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateFinancialMetrics, 
  simulateDecision, 
  generateTrajectoryData 
} from '../utils/financeEngine.js';
import { INITIAL_FINANCIAL_STATE } from '../data/initialData.js';

describe('PULSE 30 Financial Engine Unit Tests', () => {
  test('accurately calculates liquid balance and safe daily burn rate', () => {
    const metrics = calculateFinancialMetrics(INITIAL_FINANCIAL_STATE);
    
    assert.ok(typeof metrics.safeDailyAllowance === 'number', 'Daily burn should be numeric');
    assert.ok(metrics.safeDailyAllowance >= 0, 'Daily burn should be non-negative');
    assert.ok(metrics.liquidBalance > 0, 'Liquid balance should be positive');
    assert.equal(metrics.currentDay, 9, 'Should start at day 9 by default');
    assert.equal(metrics.remainingDays, 22, '30 - 9 + 1 = 22 remaining days');
  });

  test('correctly cascades purchase simulation to safe daily allowance', () => {
    const action = {
      type: 'PURCHASE',
      title: 'Sneakers',
      amount: 1000,
      category: 'Fashion',
      tier: 'want'
    };

    const sim = simulateDecision(INITIAL_FINANCIAL_STATE, action);

    assert.ok(sim.simulatedMetrics.liquidBalance < sim.currentMetrics.liquidBalance, 'Balance should decrease after purchase');
    assert.ok(sim.deltas.dailyAllowanceDelta < 0, 'Daily allowance should decrease');
    assert.ok(sim.deltas.liquidBalanceDelta === -1000, 'Delta should reflect 1000 INR spend');
  });

  test('correctly simulates subscription pause with daily allowance recovery', () => {
    const action = {
      type: 'SUBSCRIPTION_TOGGLE',
      subId: 'sub-2',
      active: false
    };

    const sim = simulateDecision(INITIAL_FINANCIAL_STATE, action);
    assert.ok(sim.deltas.dailyAllowanceDelta >= 0, 'Pausing a subscription should increase or maintain daily allowance');
  });

  test('generates valid 30-day solvency trajectory curve', () => {
    const trajectory = generateTrajectoryData(INITIAL_FINANCIAL_STATE);
    assert.equal(trajectory.length, 30, 'Should generate trajectory for all 30 days');
    assert.ok(trajectory[0].day === 1, 'Trajectory starts at Day 1');
    assert.ok(trajectory[29].day === 30, 'Trajectory ends at Day 30');
  });
});
