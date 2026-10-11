import React from 'react';
import { Sparkles, CheckCircle2, X, ArrowRight, AlertTriangle, Flame } from 'lucide-react';
import { playSuccessChime, playClick } from '../utils/audioEffects';

export function SimulationBanner({ 
  simulationNarrative, 
  deltas, 
  onCommit, 
  onCancel,
  currentMetrics,
  simulatedMetrics
}) {
  const isAllowanceDrop = deltas.dailyAllowanceDelta < 0;
  const isDeficit = simulatedMetrics.projectedDay30Balance < 0;

  return (
    <div className="sim-global-banner animate-slide-up">
      <div className="sim-banner-content">
        <div className="sim-banner-left">
          <div className="sim-banner-badge animate-pulse-glow">
            <Sparkles size={16} />
            <span>SIMULATION PREVIEW</span>
          </div>

          <div className="sim-banner-narrative">
            <span className="narrative-tag">Testing Move:</span>
            <strong className="narrative-text">{simulationNarrative}</strong>
          </div>
        </div>

        {/* Live cascading deltas */}
        <div className="sim-banner-deltas">
          <div className="banner-delta-pill">
            <span className="text-secondary text-xs">Safe Daily Burn:</span>
            <span className="mono font-bold">
              ₹{currentMetrics.safeDailyAllowance} → ₹{simulatedMetrics.safeDailyAllowance}/d
            </span>
            <span className={`delta-tag ${isAllowanceDrop ? 'text-rose' : 'text-mint'}`}>
              ({deltas.dailyAllowanceDelta >= 0 ? `+₹${deltas.dailyAllowanceDelta}` : `-₹${Math.abs(deltas.dailyAllowanceDelta)}`})
            </span>
          </div>

          <div className="banner-delta-pill">
            <span className="text-secondary text-xs">Day 30 Cash:</span>
            <span className={`mono font-bold ${isDeficit ? 'text-rose' : 'text-mint'}`}>
              {simulatedMetrics.projectedDay30Balance < 0 ? '-' : '+'}₹{Math.abs(simulatedMetrics.projectedDay30Balance)}
            </span>
          </div>

          <div className="banner-delta-pill">
            <span className="text-secondary text-xs">Health:</span>
            <span className="mono font-bold">
              {currentMetrics.healthScore} → {simulatedMetrics.healthScore}
            </span>
            <span className={`delta-tag ${deltas.healthScoreDelta < 0 ? 'text-rose' : 'text-mint'}`}>
              ({deltas.healthScoreDelta >= 0 ? `+${deltas.healthScoreDelta}` : `${deltas.healthScoreDelta}`})
            </span>
          </div>
        </div>

        {/* Banner actions */}
        <div className="sim-banner-actions">
          <button 
            className="btn-banner-commit"
            onClick={() => {
              playSuccessChime();
              onCommit();
            }}
            title="Apply this decision to your live 30-day budget"
          >
            <CheckCircle2 size={15} />
            <span>Commit to Reality</span>
          </button>

          <button 
            className="btn-banner-cancel"
            onClick={() => {
              playClick();
              onCancel();
            }}
            title="Discard this simulation"
          >
            <X size={15} />
            <span>Exit Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}
