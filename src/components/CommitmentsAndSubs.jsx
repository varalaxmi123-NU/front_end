import React from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Tv, 
  Music, 
  Film, 
  ShoppingBag, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const subIconMap = {
  Music,
  Film,
  ShoppingBag,
  Tv,
};

export function CommitmentsAndSubs({ 
  fixedCommitments = [], 
  subscriptions = [], 
  currentDay = 9, 
  remainingDays = 22,
  onToggleSubscription,
  onPayCommitment 
}) {
  const totalCommitments = fixedCommitments.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const unpaidCommitments = fixedCommitments
    .filter((c) => !c.isPaid && c.dueDay >= currentDay)
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

  const activeSubsMonthly = subscriptions
    .filter((s) => s.active)
    .reduce((acc, s) => acc + (Number(s.amount) || 0), 0);

  return (
    <div className="commitments-subs-grid">
      {/* 1. Fixed Commitments Panel */}
      <div className="glass-panel commitments-panel">
        <div className="panel-header-row">
          <div className="panel-title-wrap">
            <div className="panel-icon-badge icon-amber">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="panel-title">Fixed Commitments & Bills</h3>
              <p className="panel-subtitle">
                ₹{unpaidCommitments.toLocaleString('en-IN')} remaining due this month
              </p>
            </div>
          </div>
          <span className="badge badge-amber">Non-Negotiable</span>
        </div>

        <div className="commitments-list">
          {fixedCommitments.map((item) => {
            const isDueSoon = !item.isPaid && item.dueDay >= currentDay && (item.dueDay - currentDay <= 5);
            const isPast = currentDay > item.dueDay && !item.isPaid;

            return (
              <div 
                key={item.id} 
                className={`commitment-item ${item.isPaid ? 'paid' : ''} ${isDueSoon ? 'due-soon' : ''}`}
              >
                <div className="commitment-left">
                  <div className={`status-indicator-dot ${item.isPaid ? 'dot-paid' : 'dot-pending'}`} />
                  <div>
                    <h5 className="commitment-name">{item.name}</h5>
                    <div className="commitment-meta">
                      <span className="due-day-tag">Due Day {item.dueDay}</span>
                      <span className="meta-divider">•</span>
                      <span className="commitment-cat">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="commitment-right">
                  <span className="commitment-amount mono">₹{item.amount.toLocaleString('en-IN')}</span>
                  {item.isPaid ? (
                    <span className="badge-paid">
                      <CheckCircle2 size={13} />
                      <span>Paid D{item.paidDay}</span>
                    </span>
                  ) : (
                    <button 
                      className="btn-pay-now"
                      onClick={() => onPayCommitment(item.id)}
                      title="Mark as paid now"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Subscriptions Management Panel */}
      <div className="glass-panel subscriptions-panel">
        <div className="panel-header-row">
          <div className="panel-title-wrap">
            <div className="panel-icon-badge icon-violet">
              <Tv size={16} />
            </div>
            <div>
              <h3 className="panel-title">Recurring Subscriptions</h3>
              <p className="panel-subtitle">
                Total ₹{activeSubsMonthly}/mo active • Toggle to free up daily burn
              </p>
            </div>
          </div>
          <span className="badge badge-violet">Flexible Dues</span>
        </div>

        <div className="subscriptions-list">
          {subscriptions.map((sub) => {
            const Icon = subIconMap[sub.icon] || Tv;
            const dailyCost = (sub.amount / Math.max(1, remainingDays)).toFixed(1);

            return (
              <div 
                key={sub.id} 
                className={`sub-card-item ${sub.active ? 'active' : 'paused'}`}
              >
                <div className="sub-left">
                  <div className="sub-icon-avatar">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h5 className="sub-name">{sub.name}</h5>
                    <div className="sub-meta">
                      <span>Renews Day {sub.dueDay}</span>
                      <span className="meta-divider">•</span>
                      <span className="sub-impact-text text-muted">
                        Costs ₹{dailyCost}/d for rest of month
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sub-right">
                  <div className="sub-price mono">₹{sub.amount}<span className="text-xs text-muted">/mo</span></div>
                  <button 
                    className={`sub-toggle-btn ${sub.active ? 'btn-active' : 'btn-paused'}`}
                    onClick={() => onToggleSubscription(sub.id, !sub.active)}
                    title={sub.active ? "Click to pause subscription" : "Click to reactivate subscription"}
                  >
                    {sub.active ? (
                      <>
                        <ToggleRight size={22} className="text-mint" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={22} className="text-muted" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
