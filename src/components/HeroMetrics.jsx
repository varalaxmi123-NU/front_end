import React from 'react';
import { 
  Wallet, 
  Flame, 
  Lock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function HeroMetrics({ 
  metrics, 
  simulatedMetrics = null, 
  isSimulating = false,
  onOpenSimulator 
}) {
  const activeMetrics = isSimulating && simulatedMetrics ? simulatedMetrics : metrics;

  const {
    liquidBalance,
    safeDailyAllowance,
    totalUpcomingObligations,
    projectedDay30Balance,
    remainingDays,
    dailyDiscretionaryBurn,
    runwayDays,
    riskLevel,
    riskLabel,
    totalVaultSavings,
    totalIncome,
  } = activeMetrics;

  const isDeficit = projectedDay30Balance < 0;
  const isAllowanceTight = safeDailyAllowance < 100;
  const burnDiff = dailyDiscretionaryBurn - safeDailyAllowance;

  // Compute deltas if simulating
  const balanceDelta = isSimulating && simulatedMetrics ? simulatedMetrics.liquidBalance - metrics.liquidBalance : 0;
  const allowanceDelta = isSimulating && simulatedMetrics ? simulatedMetrics.safeDailyAllowance - metrics.safeDailyAllowance : 0;
  const forecastDelta = isSimulating && simulatedMetrics ? simulatedMetrics.projectedDay30Balance - metrics.projectedDay30Balance : 0;
  const runwayDelta = isSimulating && simulatedMetrics ? simulatedMetrics.runwayDays - metrics.runwayDays : 0;

  return (
    <div className={`hero-metrics-grid ${isSimulating ? 'simulating-active-grid' : ''}`}>
      {/* 1. Liquid Balance in Hand */}
      <div className={`glass-panel metric-card ${isSimulating ? 'sim-pulsing-card' : ''}`}>
        <div className="metric-card-header">
          <span className="metric-label">
            {isSimulating ? "Simulated Liquid Cash" : "Liquid Cash In Bank"}
          </span>
          <div className="metric-icon-wrap icon-cyan">
            <Wallet size={18} />
          </div>
        </div>
        <div className="metric-card-body">
          <div className="metric-primary-val mono">
            ₹{liquidBalance.toLocaleString('en-IN')}
          </div>
          {isSimulating ? (
            <div className="metric-sim-delta-row">
              <span className="text-secondary text-xs">Reality: ₹{metrics.liquidBalance.toLocaleString('en-IN')}</span>
              <span className={`sim-delta-badge mono ${balanceDelta < 0 ? 'text-rose' : 'text-mint'}`}>
                {balanceDelta >= 0 ? `+₹${balanceDelta}` : `-₹${Math.abs(balanceDelta)}`}
              </span>
            </div>
          ) : (
            <div className="metric-subtext">
              <span>After ₹{totalVaultSavings.toLocaleString('en-IN')} vaulted</span>
              <span className="metric-sub-divider">•</span>
              <span className="mono font-semibold">₹10K Base</span>
            </div>
          )}
        </div>
        <div className="metric-footer">
          <div className="metric-pill pill-cyan">
            <span className="pulse-dot-cyan" />
            <span>Ready for UPI</span>
          </div>
        </div>
      </div>

      {/* 2. True Safe Daily Allowance (Star Card) */}
      <div className={`glass-panel metric-card metric-card-featured ${isSimulating ? 'sim-pulsing-card-featured' : ''}`}>
        <div className="featured-glow-fx" />
        <div className="metric-card-header">
          <div className="featured-label-wrap">
            <span className="metric-label featured-label">
              {isSimulating ? "Simulated Safe Burn" : "Safe Daily Allowance"}
            </span>
            <span className="badge badge-featured">True Burn Limit</span>
          </div>
          <div className="metric-icon-wrap icon-violet animate-pulse-glow">
            <Flame size={20} />
          </div>
        </div>
        <div className="metric-card-body">
          <div className="metric-primary-val featured-val mono">
            ₹{safeDailyAllowance.toLocaleString('en-IN')}
            <span className="metric-unit">/ day</span>
          </div>
          {isSimulating ? (
            <div className="metric-sim-delta-row">
              <span className="text-secondary text-xs">Reality: ₹{metrics.safeDailyAllowance}/day</span>
              <span className={`sim-delta-badge mono font-bold ${allowanceDelta < 0 ? 'badge-rose' : 'badge-mint'}`}>
                {allowanceDelta >= 0 ? `+₹${allowanceDelta}/d` : `-₹${Math.abs(allowanceDelta)}/d`}
              </span>
            </div>
          ) : (
            <div className="metric-subtext">
              <span>For remaining {remainingDays} days</span>
              <span className="metric-sub-divider">•</span>
              <span className={burnDiff > 0 ? "text-rose font-semibold" : "text-mint font-semibold"}>
                {burnDiff > 0 ? `Over-burning by ₹${burnDiff}/day` : `Safe (+₹${Math.abs(burnDiff)} buffer)`}
              </span>
            </div>
          )}
        </div>
        <div className="metric-footer">
          <button 
            className="metric-simulate-link" 
            onClick={onOpenSimulator}
          >
            <Sparkles size={13} />
            <span>{isSimulating ? "Tweak Simulation →" : "Simulate a swipe impact →"}</span>
          </button>
        </div>
      </div>

      {/* 3. Ringfenced Commitments & Bills */}
      <div className="glass-panel metric-card">
        <div className="metric-card-header">
          <span className="metric-label">Upcoming Bills & Subs</span>
          <div className="metric-icon-wrap icon-amber">
            <Lock size={18} />
          </div>
        </div>
        <div className="metric-card-body">
          <div className="metric-primary-val mono">
            ₹{totalUpcomingObligations.toLocaleString('en-IN')}
          </div>
          <div className="metric-subtext">
            <span>Ringfenced for bills</span>
            <span className="metric-sub-divider">•</span>
            <span className="text-secondary font-medium">Recharge, Wi-Fi, Subs</span>
          </div>
        </div>
        <div className="metric-footer">
          <div className="metric-pill pill-amber">
            <Lock size={12} />
            <span>{liquidBalance >= totalUpcomingObligations ? "100% Protected" : "Threatened!"}</span>
          </div>
        </div>
      </div>

      {/* 4. Month-End Forecast & Runway */}
      <div className={`glass-panel metric-card ${isDeficit ? 'card-alert-border' : ''}`}>
        <div className="metric-card-header">
          <span className="metric-label">
            {isSimulating ? "Simulated Day 30 Cash" : "Day 30 Cash Forecast"}
          </span>
          <div className={`metric-icon-wrap ${isDeficit ? 'icon-rose' : 'icon-mint'}`}>
            {isDeficit ? <AlertTriangle size={18} /> : <TrendingUp size={18} />}
          </div>
        </div>
        <div className="metric-card-body">
          <div className={`metric-primary-val mono ${isDeficit ? 'text-rose' : 'text-mint'}`}>
            {isDeficit ? '-' : '+'}₹{Math.abs(projectedDay30Balance).toLocaleString('en-IN')}
          </div>
          <div className="metric-subtext">
            <span>Runway: </span>
            <strong className={runwayDays < 30 ? "text-rose" : "text-mint"}>
              {runwayDays >= 30 ? "Full 30 Days Safe" : `Depletes on Day ${runwayDays}!`}
            </strong>
          </div>
        </div>
        <div className="metric-footer">
          <div className={`metric-pill ${
            riskLevel === 'LOW' ? 'pill-mint' : 
            riskLevel === 'MODERATE' ? 'pill-amber' : 'pill-rose'
          }`}>
            <span className={`pulse-dot-${riskLevel.toLowerCase()}`} />
            <span>{riskLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
