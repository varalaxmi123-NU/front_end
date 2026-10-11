import React from 'react';
import { Activity, Target } from 'lucide-react';

export function FinancialHealthWidget({ 
  metrics, 
  simulatedMetrics = null, 
  isSimulating = false 
}) {
  const activeMetrics = isSimulating && simulatedMetrics ? simulatedMetrics : metrics;

  const {
    healthScore,
    healthTier,
    healthTheme,
    pillars,
    safeDailyAllowance,
  } = activeMetrics;

  const scoreDelta = isSimulating && simulatedMetrics ? simulatedMetrics.healthScore - metrics.healthScore : 0;

  // SVG circular gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const getScoreColor = () => {
    if (healthScore >= 80) return "var(--accent-mint)";
    if (healthScore >= 65) return "var(--accent-cyan)";
    if (healthScore >= 45) return "var(--accent-amber)";
    return "var(--accent-rose)";
  };

  return (
    <div className={`glass-panel health-widget-card ${isSimulating ? 'sim-pulsing-health' : ''}`}>
      <div className="health-widget-header">
        <div className="health-title-group">
          <div className="health-icon-badge">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="health-card-title">
              {isSimulating ? "Simulated Health & Risk" : "Financial Health & Risk"}
            </h3>
            <p className="health-card-subtitle">Real-time composite solvency rating</p>
          </div>
        </div>

        <span className={`badge badge-${healthTheme}`}>
          {healthTier}
        </span>
      </div>

      <div className="health-body-layout">
        {/* Radial Circular Score Meter */}
        <div className="health-gauge-container">
          <div className="gauge-svg-wrapper">
            <svg className="health-svg-ring" width="130" height="130" viewBox="0 0 130 130">
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="gauge-bg-circle"
                strokeWidth="10"
              />
              {/* Animated Progress circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="gauge-fg-circle"
                strokeWidth="10"
                stroke={getScoreColor()}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
              />
            </svg>
            <div className="gauge-center-content">
              <span className="gauge-score-number mono">{healthScore}</span>
              <span className="gauge-score-max">/ 100</span>
            </div>
          </div>
          {isSimulating ? (
            <div className="gauge-sim-delta mono">
              <span className={scoreDelta < 0 ? 'text-rose font-bold' : 'text-mint font-bold'}>
                {scoreDelta >= 0 ? `+${scoreDelta}` : `${scoreDelta}`} pts
              </span>
            </div>
          ) : (
            <div className="gauge-footer-tag">
              <span className="mono text-muted text-xs">VIBE METRIC</span>
            </div>
          )}
        </div>

        {/* 4 Health Pillars Breakdown */}
        <div className="health-pillars-list">
          {/* Pillar 1: Runway */}
          <div className="pillar-item">
            <div className="pillar-info">
              <span className="pillar-name">Runway & Balance Buffer</span>
              <span className="pillar-score mono">{pillars.runway} / 30</span>
            </div>
            <div className="pillar-track">
              <div 
                className="pillar-fill fill-cyan"
                style={{ width: `${(pillars.runway / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 2: Daily Allowance Discipline */}
          <div className="pillar-item">
            <div className="pillar-info">
              <span className="pillar-name">Daily Burn Viability</span>
              <span className="pillar-score mono">{pillars.allowance} / 25</span>
            </div>
            <div className="pillar-track">
              <div 
                className="pillar-fill fill-violet"
                style={{ width: `${(pillars.allowance / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 3: Commitment Security */}
          <div className="pillar-item">
            <div className="pillar-info">
              <span className="pillar-name">Upcoming Bills Ringfenced</span>
              <span className="pillar-score mono">{pillars.commitments} / 25</span>
            </div>
            <div className="pillar-track">
              <div 
                className="pillar-fill fill-amber"
                style={{ width: `${(pillars.commitments / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 4: Savings Resilience */}
          <div className="pillar-item">
            <div className="pillar-info">
              <span className="pillar-name">Emergency Shield & Vaults</span>
              <span className="pillar-score mono">{pillars.savings} / 20</span>
            </div>
            <div className="pillar-track">
              <div 
                className="pillar-fill fill-mint"
                style={{ width: `${(pillars.savings / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Actionable Coach Advice */}
      <div className="health-coach-bar">
        <div className="coach-bubble-icon">
          <Target size={15} />
        </div>
        <p className="coach-advice-text">
          {isSimulating && (
            scoreDelta < 0 
              ? `🚨 Simulation Alert: This decision cuts your financial health by ${Math.abs(scoreDelta)} points and reduces your safe daily burn to ₹${safeDailyAllowance}/day.`
              : `🚀 Positive Simulation: This move improves your financial health by +${scoreDelta} points and expands your runway!`
          )}
          {!isSimulating && healthScore >= 80 && "🔥 Your ₹10K allocation is pristine. You can safely save extra in the Sneaker Vault without straining your allowance."}
          {!isSimulating && healthScore >= 65 && healthScore < 80 && "⚡ Stable position! Keeping daily spends below ₹" + safeDailyAllowance + " secures a positive month-end buffer."}
          {!isSimulating && healthScore >= 45 && healthScore < 65 && "⚠️ Caution: High burn velocity. Consider pausing an inactive streaming sub or limiting cafe runs for 4 days."}
          {!isSimulating && healthScore < 45 && "🚨 Insolvent Trajectory: You run out of cash before Day 30. Use the Decision Simulator to plan a recovery cut or gig!"}
        </p>
      </div>
    </div>
  );
}
