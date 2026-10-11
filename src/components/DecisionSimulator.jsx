import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ShieldAlert,
  Flame,
  Wallet,
  Clock,
  Layers,
  ShoppingBag,
  Tv,
  Coins,
  Shield,
  Percent
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { simulateDecision } from '../utils/financeEngine';

export function DecisionSimulator({ 
  currentState, 
  onCommitDecision, 
  onClose,
  onLiveSimulate,
  isModal = false 
}) {
  // Simulator form state
  const [activeTab, setActiveTab] = useState('PURCHASE'); // 'PURCHASE' | 'SUBSCRIPTION' | 'GIG' | 'VAULT' | 'DIET'
  
  // Purchase form
  const [purchaseTitle, setPurchaseTitle] = useState('Sneakers / Jacket Drop');
  const [purchaseAmount, setPurchaseAmount] = useState(1800);
  const [purchaseCategory, setPurchaseCategory] = useState('Fashion');
  const [purchaseTier, setPurchaseTier] = useState('want');

  // Subscription form
  const [selectedSubId, setSelectedSubId] = useState(currentState.subscriptions[1]?.id || 'sub-2');
  const [subAction, setSubAction] = useState(false); // false = cancel/pause, true = resume

  // Gig income form
  const [gigSource, setGigSource] = useState('Freelance UI Design Gig');
  const [gigAmount, setGigAmount] = useState(1200);

  // Vault form
  const [selectedVaultId, setSelectedVaultId] = useState(currentState.savingsVaults[0]?.id || 'vault-1');
  const [vaultAmount, setVaultAmount] = useState(500);
  const [vaultDirection, setVaultDirection] = useState('DEPOSIT');

  // Spending Diet form
  const [spendingCutPercent, setSpendingCutPercent] = useState(30);

  // Pre-configured impulse buy quick presets
  const impulsePresets = [
    { title: "Zomato Group Biryani", amount: 480, category: "Dining" },
    { title: "Weekend Rooftop Party", amount: 850, category: "Social" },
    { title: "Zara Hoodie / Sneakers", amount: 1800, category: "Fashion" },
    { title: "Music Fest Early Bird", amount: 2400, category: "Entertainment" },
    { title: "Noise-Cancelling Buds", amount: 3200, category: "Tech" },
  ];

  // Derive current simulation action based on active tab
  const getSimulationAction = () => {
    switch (activeTab) {
      case 'PURCHASE':
        return {
          type: 'PURCHASE',
          title: purchaseTitle,
          amount: Number(purchaseAmount) || 0,
          category: purchaseCategory,
          tier: purchaseTier,
        };
      case 'SUBSCRIPTION':
        return {
          type: 'SUBSCRIPTION_TOGGLE',
          subId: selectedSubId,
          active: subAction,
        };
      case 'GIG':
        return {
          type: 'GIG_INCOME',
          source: gigSource,
          amount: Number(gigAmount) || 0,
        };
      case 'VAULT':
        return {
          type: 'VAULT_TRANSFER',
          vaultId: selectedVaultId,
          amount: Number(vaultAmount) || 0,
          direction: vaultDirection,
        };
      case 'DIET':
        return {
          type: 'SPENDING_CUT',
          percentageCut: Number(spendingCutPercent) || 20,
        };
      default:
        return { type: 'NONE' };
    }
  };

  const currentAction = getSimulationAction();
  const simResult = simulateDecision(currentState, currentAction);
  const { currentMetrics, simulatedMetrics, deltas, aiAdvisorInsight, simulationNarrative } = simResult;

  // Broadcast simulation to full dashboard live
  React.useEffect(() => {
    if (onLiveSimulate) {
      onLiveSimulate(currentAction, simResult);
    }
  }, [
    activeTab, 
    purchaseTitle, 
    purchaseAmount, 
    purchaseCategory, 
    purchaseTier,
    selectedSubId, 
    subAction, 
    gigSource, 
    gigAmount, 
    selectedVaultId, 
    vaultAmount, 
    vaultDirection, 
    spendingCutPercent,
    currentState.currentDay
  ]);

  // Handle Commit decision
  const handleCommit = () => {
    // Fire celebration confetti if positive or successful
    if (deltas.dailyAllowanceDelta >= 0 || deltas.healthScoreDelta >= 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    onCommitDecision(currentAction, simResult);
  };

  return (
    <div className={`simulator-panel glass-panel ${isModal ? 'simulator-modal-view' : ''}`}>
      {/* Simulator Header */}
      <div className="simulator-header">
        <div className="simulator-title-wrap">
          <div className="simulator-icon-badge animate-pulse-glow">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="simulator-title">Decision Sandbox & What-If Simulator</h2>
            <p className="simulator-subtitle">
              Test-drive financial moves before swiping. See exact impact on balance, allowance, and runway.
            </p>
          </div>
        </div>

        {isModal && (
          <button className="btn-icon" onClick={onClose} title="Close Simulator">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Simulator Mode Tabs */}
      <div className="simulator-tab-bar">
        <button 
          className={`sim-tab ${activeTab === 'PURCHASE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PURCHASE')}
        >
          <ShoppingBag size={15} />
          <span>Impulse / Big Spend</span>
        </button>

        <button 
          className={`sim-tab ${activeTab === 'SUBSCRIPTION' ? 'active' : ''}`}
          onClick={() => setActiveTab('SUBSCRIPTION')}
        >
          <Tv size={15} />
          <span>Adjust Subscriptions</span>
        </button>

        <button 
          className={`sim-tab ${activeTab === 'GIG' ? 'active' : ''}`}
          onClick={() => setActiveTab('GIG')}
        >
          <Coins size={15} />
          <span>Add Side Gig (+₹)</span>
        </button>

        <button 
          className={`sim-tab ${activeTab === 'VAULT' ? 'active' : ''}`}
          onClick={() => setActiveTab('VAULT')}
        >
          <Shield size={15} />
          <span>Vault Lock / Transfer</span>
        </button>

        <button 
          className={`sim-tab ${activeTab === 'DIET' ? 'active' : ''}`}
          onClick={() => setActiveTab('DIET')}
        >
          <Percent size={15} />
          <span>Spending Diet (-%)</span>
        </button>
      </div>

      {/* Interactive Controls per Mode */}
      <div className="simulator-controls-container">
        {activeTab === 'PURCHASE' && (
          <div className="sim-mode-form animate-slide-up">
            <div className="preset-chips-row">
              <span className="preset-chips-label">Quick Test Presets:</span>
              <div className="preset-chips">
                {impulsePresets.map((p) => (
                  <button
                    key={p.title}
                    className="preset-chip-btn"
                    onClick={() => {
                      setPurchaseTitle(p.title);
                      setPurchaseAmount(p.amount);
                      setPurchaseCategory(p.category);
                    }}
                  >
                    <span>{p.title}</span>
                    <span className="chip-amt mono">₹{p.amount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sim-input-grid">
              <div className="sim-input-group">
                <label>Item / Expense Name</label>
                <input
                  type="text"
                  value={purchaseTitle}
                  onChange={(e) => setPurchaseTitle(e.target.value)}
                  placeholder="e.g. Zara Jacket, Concert VIP"
                />
              </div>

              <div className="sim-input-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                />
              </div>

              <div className="sim-input-group">
                <label>Spend Classification</label>
                <div className="tier-toggle-group">
                  <button
                    className={`tier-toggle-btn ${purchaseTier === 'want' ? 'active want' : ''}`}
                    onClick={() => setPurchaseTier('want')}
                  >
                    Discretionary Want
                  </button>
                  <button
                    className={`tier-toggle-btn ${purchaseTier === 'need' ? 'active need' : ''}`}
                    onClick={() => setPurchaseTier('need')}
                  >
                    Non-Negotiable Need
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SUBSCRIPTION' && (
          <div className="sim-mode-form animate-slide-up">
            <p className="sim-mode-desc">
              Subscriptions leak cash every month. Simulate canceling or pausing to see how much daily allowance you free up immediately.
            </p>
            <div className="sim-input-grid">
              <div className="sim-input-group">
                <label>Select Subscription</label>
                <select
                  value={selectedSubId}
                  onChange={(e) => setSelectedSubId(e.target.value)}
                >
                  {currentState.subscriptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (₹{s.amount}/month) — {s.active ? "Currently Active" : "Paused"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sim-input-group">
                <label>Simulate Action</label>
                <div className="tier-toggle-group">
                  <button
                    className={`tier-toggle-btn ${!subAction ? 'active want' : ''}`}
                    onClick={() => setSubAction(false)}
                  >
                    Pause / Cancel Sub
                  </button>
                  <button
                    className={`tier-toggle-btn ${subAction ? 'active need' : ''}`}
                    onClick={() => setSubAction(true)}
                  >
                    Keep / Resume Sub
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'GIG' && (
          <div className="sim-mode-form animate-slide-up">
            <p className="sim-mode-desc">
              Gen Z power move: Offset a splurge or recover runway by simulating a freelance assignment, tutoring, or campus gig.
            </p>
            <div className="sim-input-grid">
              <div className="sim-input-group">
                <label>Income / Gig Source</label>
                <input
                  type="text"
                  value={gigSource}
                  onChange={(e) => setGigSource(e.target.value)}
                  placeholder="e.g. Freelance Figma Design, Weekend Math Tutoring"
                />
              </div>

              <div className="sim-input-group">
                <label>Payout Amount (₹)</label>
                <input
                  type="number"
                  min="200"
                  max="10000"
                  step="100"
                  value={gigAmount}
                  onChange={(e) => setGigAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'VAULT' && (
          <div className="sim-mode-form animate-slide-up">
            <p className="sim-mode-desc">
              Moving money into a Vault protects it from impulse spending. Test transferring between your Liquid Account and Savings Vaults.
            </p>
            <div className="sim-input-grid">
              <div className="sim-input-group">
                <label>Select Vault</label>
                <select
                  value={selectedVaultId}
                  onChange={(e) => setSelectedVaultId(e.target.value)}
                >
                  {currentState.savingsVaults.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Current: ₹{v.current} / Target: ₹{v.target})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sim-input-group">
                <label>Action</label>
                <div className="tier-toggle-group">
                  <button
                    className={`tier-toggle-btn ${vaultDirection === 'DEPOSIT' ? 'active need' : ''}`}
                    onClick={() => setVaultDirection('DEPOSIT')}
                  >
                    Lock into Vault
                  </button>
                  <button
                    className={`tier-toggle-btn ${vaultDirection === 'WITHDRAW' ? 'active want' : ''}`}
                    onClick={() => setVaultDirection('WITHDRAW')}
                  >
                    Withdraw to Liquid
                  </button>
                </div>
              </div>

              <div className="sim-input-group">
                <label>Transfer Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  max="5000"
                  step="100"
                  value={vaultAmount}
                  onChange={(e) => setVaultAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'DIET' && (
          <div className="sim-mode-form animate-slide-up">
            <p className="sim-mode-desc">
              Simulate cutting non-essential daily spends (eating out, chai runs, impulse deliveries) for the rest of the 30-day cycle.
            </p>
            <div className="diet-slider-wrap">
              <div className="diet-slider-header">
                <span>Discretionary Spending Reduction:</span>
                <span className="diet-percent-val mono font-bold text-mint">-{spendingCutPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="5"
                value={spendingCutPercent}
                onChange={(e) => setSpendingCutPercent(Number(e.target.value))}
              />
              <div className="diet-ticks">
                <span>10% (Mild)</span>
                <span>30% (Standard)</span>
                <span>50% (Hardcore Frugal)</span>
                <span>70% (Monk Mode)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Side-by-Side Impact Matrix */}
      <div className="sim-impact-section">
        <div className="sim-impact-title-row">
          <h4 className="sim-impact-title">Consequence Telemetry Matrix</h4>
          <span className="badge badge-cyan">Real-Time Forecast</span>
        </div>

        <div className="sim-matrix-grid">
          {/* 1. Liquid Balance Delta */}
          <div className="sim-matrix-card">
            <span className="matrix-label">Liquid Balance</span>
            <div className="matrix-comparison">
              <span className="matrix-before mono">₹{currentMetrics.liquidBalance.toLocaleString('en-IN')}</span>
              <ArrowRight size={14} className="matrix-arrow" />
              <span className={`matrix-after mono ${deltas.liquidBalanceDelta < 0 ? 'text-rose' : 'text-mint'}`}>
                ₹{simulatedMetrics.liquidBalance.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="matrix-delta mono">
              {deltas.liquidBalanceDelta >= 0 ? `+₹${deltas.liquidBalanceDelta}` : `-₹${Math.abs(deltas.liquidBalanceDelta)}`}
            </div>
          </div>

          {/* 2. Safe Daily Allowance Delta */}
          <div className="sim-matrix-card highlight-matrix">
            <span className="matrix-label">Safe Daily Allowance</span>
            <div className="matrix-comparison">
              <span className="matrix-before mono">₹{currentMetrics.safeDailyAllowance}/d</span>
              <ArrowRight size={14} className="matrix-arrow" />
              <span className={`matrix-after mono font-bold ${deltas.dailyAllowanceDelta < 0 ? 'text-rose' : 'text-mint'}`}>
                ₹{simulatedMetrics.safeDailyAllowance}/d
              </span>
            </div>
            <div className="matrix-delta mono font-semibold">
              {deltas.dailyAllowanceDelta >= 0 ? `+₹${deltas.dailyAllowanceDelta}/day` : `-₹${Math.abs(deltas.dailyAllowanceDelta)}/day`}
              {currentMetrics.safeDailyAllowance > 0 && (
                <span className="delta-percent">
                  ({Math.round((deltas.dailyAllowanceDelta / currentMetrics.safeDailyAllowance) * 100)}%)
                </span>
              )}
            </div>
          </div>

          {/* 3. Day 30 Ending Forecast */}
          <div className="sim-matrix-card">
            <span className="matrix-label">Day 30 Cash Forecast</span>
            <div className="matrix-comparison">
              <span className="matrix-before mono">
                {currentMetrics.projectedDay30Balance < 0 ? '-' : '+'}₹{Math.abs(currentMetrics.projectedDay30Balance)}
              </span>
              <ArrowRight size={14} className="matrix-arrow" />
              <span className={`matrix-after mono ${simulatedMetrics.projectedDay30Balance < 0 ? 'text-rose font-bold' : 'text-mint'}`}>
                {simulatedMetrics.projectedDay30Balance < 0 ? '-' : '+'}₹{Math.abs(simulatedMetrics.projectedDay30Balance)}
              </span>
            </div>
            <div className="matrix-delta mono">
              {simulatedMetrics.projectedDay30Balance < 0 ? '⚠️ DEFICIT ALERT' : 'Safe Runway'}
            </div>
          </div>

          {/* 4. Financial Health Score */}
          <div className="sim-matrix-card">
            <span className="matrix-label">Financial Health Score</span>
            <div className="matrix-comparison">
              <span className="matrix-before mono">{currentMetrics.healthScore}</span>
              <ArrowRight size={14} className="matrix-arrow" />
              <span className={`matrix-after mono ${deltas.healthScoreDelta < 0 ? 'text-rose' : 'text-mint'}`}>
                {simulatedMetrics.healthScore} / 100
              </span>
            </div>
            <div className="matrix-delta mono">
              {deltas.healthScoreDelta >= 0 ? `+${deltas.healthScoreDelta} pts` : `${deltas.healthScoreDelta} pts`}
            </div>
          </div>
        </div>

        {/* AI Financial Coach Guidance */}
        {aiAdvisorInsight && (
          <div className={`sim-advisor-card advisor-${aiAdvisorInsight.tone} animate-slide-up`}>
            <div className="advisor-header">
              <span className="advisor-badge">PULSE COPILOT FEEDBACK</span>
              <h5 className="advisor-title">{aiAdvisorInsight.title}</h5>
            </div>
            <p className="advisor-summary">{aiAdvisorInsight.summary}</p>
            <p className="advisor-detail">{aiAdvisorInsight.detail}</p>
            <div className="advisor-tip-wrap">
              <Sparkles size={14} className="text-violet" />
              <span className="advisor-tip-text">
                <strong>Pro-tip:</strong> {aiAdvisorInsight.actionableTip}
              </span>
            </div>
          </div>
        )}

        {/* Action Decision Execution */}
        <div className="sim-actions-footer">
          <div className="sim-narrative-box">
            <span className="text-secondary text-sm">Evaluating:</span>
            <strong className="sim-narrative-text">{simulationNarrative}</strong>
          </div>

          <div className="sim-btn-group">
            <button 
              className="btn-commit-action"
              onClick={handleCommit}
              title="Apply this decision to your live 30-day budget"
            >
              <CheckCircle2 size={16} />
              <span>Commit Decision To Reality</span>
            </button>

            {isModal && (
              <button 
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel Preview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
