import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Flame, 
  Lightbulb, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';

export function PulseCopilot({ metrics, onQuickSimulate, onOpenSimulator }) {
  const {
    safeDailyAllowance,
    dailyDiscretionaryBurn,
    remainingDays,
    liquidBalance,
    totalUpcomingObligations,
    projectedDay30Balance,
    healthScore,
    riskLevel,
  } = metrics;

  // Generate intelligent recommendations tailored to state
  const getActionableStrategies = () => {
    const list = [];

    if (dailyDiscretionaryBurn > safeDailyAllowance) {
      list.push({
        id: "strat-diet",
        badge: "Burn Control",
        title: "Discretionary 25% Soft Diet",
        desc: `You're burning ₹${dailyDiscretionaryBurn}/day vs ₹${safeDailyAllowance}/day limit. Cutting Swiggy/cafe runs recovers ₹${Math.round((dailyDiscretionaryBurn - safeDailyAllowance) * remainingDays)} across the month.`,
        actionLabel: "Simulate 25% Cut",
        actionType: "DIET",
        actionPayload: { percentageCut: 25 },
      });
    }

    if (liquidBalance - totalUpcomingObligations < 500) {
      list.push({
        id: "strat-gig",
        badge: "Cash Injection",
        title: "Quick Weekend Freelance Hustle",
        desc: "Upcoming bills threaten your cash cushion. Earning just ₹1,200 from a side gig instantly pushes your daily allowance up by +₹" + Math.round(1200 / remainingDays) + "/day.",
        actionLabel: "Simulate +₹1,200 Gig",
        actionType: "GIG",
        actionPayload: { amount: 1200, source: "Campus Tutoring / UI Design" },
      });
    }

    list.push({
      id: "strat-vault",
      badge: "Wealth Habit",
      title: "Round-up Stash to Emergency Shield",
      desc: "Lock ₹250 into your Emergency Shield to raise your Financial Health Score resilience pillar without denting daily essentials.",
      actionLabel: "Simulate +₹250 Stash",
      actionType: "VAULT",
      actionPayload: { vaultId: "vault-1", amount: 250, direction: "DEPOSIT" },
    });

    return list;
  };

  const strategies = getActionableStrategies();

  return (
    <div className="glass-panel copilot-card">
      <div className="copilot-header">
        <div className="copilot-brand-wrap">
          <div className="copilot-avatar animate-pulse-glow">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="copilot-title">PULSE COPILOT</h3>
            <p className="copilot-subtitle">Gen Z AI Financial Strategist</p>
          </div>
        </div>

        <button 
          className="btn-copilot-open-sim"
          onClick={onOpenSimulator}
        >
          <Sparkles size={14} />
          <span>Full Decision Sandbox</span>
        </button>
      </div>

      <div className="copilot-insight-box">
        <div className="insight-lead">
          <Lightbulb size={16} className="text-amber" />
          <span className="insight-lead-text">
            {riskLevel === 'CRITICAL' && "🚨 Code Red: Immediate intervention required to avoid missing bill payments."}
            {riskLevel === 'HIGH' && "⚠️ Caution: High daily burn rate will deplete your remaining balance before Day 30."}
            {riskLevel === 'MODERATE' && "⚡ On track, but stay alert to sudden weekend dinner splits and food deliveries."}
            {riskLevel === 'LOW' && "🔥 Top tier discipline! You have enough cushion to treat yourself or stash extra."}
          </span>
        </div>
      </div>

      <div className="copilot-strategies-grid">
        {strategies.map((strat) => (
          <div key={strat.id} className="copilot-strat-card">
            <div className="strat-card-header">
              <span className="badge badge-violet">{strat.badge}</span>
              <h5 className="strat-title">{strat.title}</h5>
            </div>
            <p className="strat-desc">{strat.desc}</p>
            <button 
              className="btn-strat-action"
              onClick={() => onQuickSimulate(strat.actionType, strat.actionPayload)}
            >
              <span>{strat.actionLabel}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
