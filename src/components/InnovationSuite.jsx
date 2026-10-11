import React, { useState } from 'react';
import { 
  PieChart, 
  Clock, 
  Download, 
  Plus, 
  Sparkles, 
  Trash2
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audioEffects';

export function InnovationSuite({ 
  metrics, 
  financialState,
  onOpenSimulator 
}) {
  const {
    totalIncome,
    needsSpent,
    discretionarySpent,
    totalVaultSavings,
    unpaidFixedCommitments,
    unpaidSubscriptions,
    safeSpendablePool,
    safeDailyAllowance,
    healthScore,
    currentDay
  } = metrics;

  // 48-Hour Wishlist state
  const [wishlist, setWishlist] = useState([
    {
      id: 'wish-1',
      title: 'Noise-Cancelling Headphones',
      price: 2800,
      category: 'Tech',
      savedDay: currentDay - 1,
      hoursLeft: 26,
      notes: 'Waiting 48h to prevent impulse regret'
    },
    {
      id: 'wish-2',
      title: 'Weekend Gaming Pass',
      price: 650,
      category: 'Gaming',
      savedDay: currentDay,
      hoursLeft: 44,
      notes: 'Testing if urge fades by Friday'
    }
  ]);
  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishPrice, setNewWishPrice] = useState('');
  const [isAddingWish, setIsAddingWish] = useState(false);

  // Cashflow segments
  const fixedTotal = unpaidFixedCommitments + unpaidSubscriptions;
  const committedTotal = fixedTotal + needsSpent;
  const wantsTotal = discretionarySpent;
  const savingsTotal = totalVaultSavings;
  const liquidPool = safeSpendablePool;

  const totalPool = Math.max(1, totalIncome);
  const pctFixed = Math.round((committedTotal / totalPool) * 100);
  const pctWants = Math.round((wantsTotal / totalPool) * 100);
  const pctSavings = Math.round((savingsTotal / totalPool) * 100);
  const pctAvailable = Math.max(0, 100 - pctFixed - pctWants - pctSavings);

  // Handle adding to wishlist
  const handleAddWishlist = (e) => {
    e.preventDefault();
    if (!newWishTitle.trim() || !newWishPrice) return;
    playSuccessChime();
    setWishlist((prev) => [
      {
        id: `wish-${Date.now()}`,
        title: newWishTitle.trim(),
        price: Number(newWishPrice),
        category: 'Lifestyle',
        savedDay: currentDay,
        hoursLeft: 48,
        notes: '48-hour cool-off activated'
      },
      ...prev
    ]);
    setNewWishTitle('');
    setNewWishPrice('');
    setIsAddingWish(false);
  };

  const handleRemoveWish = (id) => {
    playClick();
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  // Export Financial Audit Report (JSON)
  const handleExportAudit = () => {
    playSuccessChime();
    const auditData = {
      reportTitle: "PULSE 30 Financial Solvency Audit",
      timestamp: new Date().toISOString(),
      cycleDay: currentDay,
      totalBudget: totalIncome,
      liquidBalance: metrics.liquidBalance,
      safeDailyAllowance: safeDailyAllowance,
      day30Forecast: metrics.projectedDay30Balance,
      healthScore: healthScore,
      riskLevel: metrics.riskLevel,
      pillars: metrics.pillars,
      upcomingCommitments: financialState.fixedCommitments,
      activeSubscriptions: financialState.subscriptions.filter(s => s.active),
      savingsVaults: financialState.savingsVaults,
      transactionHistory: financialState.transactions
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pulse30-audit-day${currentDay}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="innovation-suite-grid" aria-label="Financial Intelligence Suite">
      {/* 1. Cashflow Allocation Donut & 50/30/20 Rule Analysis */}
      <div className="glass-panel innovation-panel">
        <div className="panel-header-row">
          <div className="panel-title-wrap">
            <div className="panel-icon-badge icon-cyan">
              <PieChart size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 className="panel-title">50/30/20 Allocation Radar</h3>
              <p className="panel-subtitle">Needs vs. Wants vs. Vaults distribution</p>
            </div>
          </div>
          <span className="badge badge-cyan">Macro Flow</span>
        </div>

        <div className="donut-visual-container">
          <div className="donut-svg-wrapper" style={{ width: '170px', height: '170px', minWidth: '170px', minHeight: '170px', maxWidth: '170px', maxHeight: '170px', position: 'relative' }}>
            <svg 
              width="170" 
              height="170" 
              viewBox="0 0 100 100" 
              style={{ width: '170px', height: '170px', maxWidth: '170px', maxHeight: '170px', transform: 'rotate(-90deg)', display: 'block' }} 
              className="donut-chart-svg" 
              aria-label="Budget distribution chart"
            >
              {/* Needs & Fixed Segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--accent-amber)"
                strokeWidth="14"
                strokeDasharray={`${pctFixed * 2.51} 251`}
                strokeDashoffset="0"
              />
              {/* Discretionary Wants Segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--accent-rose)"
                strokeWidth="14"
                strokeDasharray={`${pctWants * 2.51} 251`}
                strokeDashoffset={`-${pctFixed * 2.51}`}
              />
              {/* Savings Vaults Segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--accent-mint)"
                strokeWidth="14"
                strokeDasharray={`${pctSavings * 2.51} 251`}
                strokeDashoffset={`-${(pctFixed + pctWants) * 2.51}`}
              />
              {/* Unallocated Safe Pool Segment */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="var(--accent-cyan)"
                strokeWidth="14"
                strokeDasharray={`${pctAvailable * 2.51} 251`}
                strokeDashoffset={`-${(pctFixed + pctWants + pctSavings) * 2.51}`}
              />
            </svg>
            <div className="donut-center-info">
              <span className="mono font-bold text-sm">₹10,000</span>
              <span className="text-xs text-muted">Budget Pool</span>
            </div>
          </div>

          {/* Legend and percentages */}
          <div className="donut-legend-col">
            <div className="donut-legend-row">
              <span className="legend-dot dot-amber" aria-hidden="true" />
              <span className="legend-label">Fixed & Needs:</span>
              <span className="mono font-bold text-amber">{pctFixed}%</span>
              <span className="legend-amt mono">(₹{committedTotal})</span>
            </div>

            <div className="donut-legend-row">
              <span className="legend-dot dot-rose" aria-hidden="true" />
              <span className="legend-label">Discretionary Wants:</span>
              <span className="mono font-bold text-rose">{pctWants}%</span>
              <span className="legend-amt mono">(₹{wantsTotal})</span>
            </div>

            <div className="donut-legend-row">
              <span className="legend-dot dot-mint" aria-hidden="true" />
              <span className="legend-label">Savings Vaults:</span>
              <span className="mono font-bold text-mint">{pctSavings}%</span>
              <span className="legend-amt mono">(₹{savingsTotal})</span>
            </div>

            <div className="donut-legend-row">
              <span className="legend-dot dot-cyan" aria-hidden="true" />
              <span className="legend-label">Safe Uncommitted:</span>
              <span className="mono font-bold text-cyan">{pctAvailable}%</span>
              <span className="legend-amt mono">(₹{liquidPool})</span>
            </div>
          </div>
        </div>

        <div className="donut-footer-tip">
          <Sparkles size={13} className="text-cyan" aria-hidden="true" />
          <span>
            Gen Z Rule of Thumb: Keep wants below 30% to avoid month-end borrow pressure.
          </span>
        </div>
      </div>

      {/* 2. 48-Hour Wishlist Cool-off Vault (Gen Z Psychological Innovation) */}
      <div className="glass-panel innovation-panel">
        <div className="panel-header-row">
          <div className="panel-title-wrap">
            <div className="panel-icon-badge icon-violet">
              <Clock size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 className="panel-title">48-Hour Impulse Wishlist</h3>
              <p className="panel-subtitle">Cool-off sandbox before swiping UPI</p>
            </div>
          </div>
          <button 
            className="btn-create-vault"
            onClick={() => setIsAddingWish(!isAddingWish)}
            aria-label="Add item to 48-hour cooloff wishlist"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Park Impulse</span>
          </button>
        </div>

        {/* Add Wish Form */}
        {isAddingWish && (
          <form onSubmit={handleAddWishlist} className="wish-add-form animate-slide-up">
            <div className="sim-input-grid">
              <div className="sim-input-group">
                <label htmlFor="wish-name">Impulse Item</label>
                <input
                  id="wish-name"
                  type="text"
                  placeholder="e.g. Trendy Jacket, Drone"
                  value={newWishTitle}
                  onChange={(e) => setNewWishTitle(e.target.value)}
                  required
                />
              </div>
              <div className="sim-input-group">
                <label htmlFor="wish-price">Price (₹)</label>
                <input
                  id="wish-price"
                  type="number"
                  placeholder="₹1,500"
                  value={newWishPrice}
                  onChange={(e) => setNewWishPrice(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="wish-actions-row">
              <button type="submit" className="btn-commit-action text-xs">
                Start 48h Timer
              </button>
              <button type="button" className="btn-secondary text-xs" onClick={() => setIsAddingWish(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Wishlist Items */}
        <div className="wishlist-items-list">
          {wishlist.length === 0 ? (
            <p className="text-muted text-xs text-center py-4">No impulse items parked right now. Stay disciplined!</p>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="wish-card-row">
                <div className="wish-info-col">
                  <h5 className="wish-title">{item.title}</h5>
                  <div className="wish-meta">
                    <span className="wish-price mono">₹{item.price.toLocaleString('en-IN')}</span>
                    <span className="meta-divider">•</span>
                    <span className="wish-timer-badge">
                      <Clock size={11} aria-hidden="true" />
                      <span>{item.hoursLeft}h left to reconsider</span>
                    </span>
                  </div>
                </div>

                <div className="wish-right-btns">
                  <button
                    className="btn-stash-chip"
                    onClick={() => {
                      playClick();
                      onOpenSimulator();
                    }}
                    title="Simulate this purchase before buying"
                    aria-label={`Simulate purchase of ${item.title}`}
                  >
                    Simulate
                  </button>
                  <button
                    className="tx-delete-btn"
                    onClick={() => handleRemoveWish(item.id)}
                    title="Cool-off worked! Drop item"
                    aria-label={`Remove ${item.title} from wishlist`}
                  >
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export Report Action */}
        <div className="export-report-bar">
          <button 
            className="btn-export-audit"
            onClick={handleExportAudit}
            title="Download full financial telemetry JSON report"
            aria-label="Download financial telemetry JSON report"
          >
            <Download size={14} aria-hidden="true" />
            <span>Export Solvency Audit Report (JSON)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
