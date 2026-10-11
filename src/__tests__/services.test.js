import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { financialCalculationService } from '../services/financialCalculationService.js';
import { INITIAL_FINANCIAL_STATE } from '../data/initialData.js';

describe('Financial Calculation Service Tests', () => {
  test('calculates daily safe allowance using net pool formula', () => {
    // 5000 liquid - 1000 dues over 10 days = 400/day
    const allowance = financialCalculationService.calculateDailyAllowance(5000, 1000, 10);
    assert.equal(allowance, 400);
  });

  test('computes metrics with valid health tier', () => {
    const metrics = financialCalculationService.computeMetrics(INITIAL_FINANCIAL_STATE);
    assert.ok(metrics.healthTier, 'Should have a health tier assigned');
    assert.ok(metrics.pillars, 'Should calculate 4 resilience pillars');
  });
});
