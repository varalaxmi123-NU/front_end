import React, { useState } from 'react';
import { 
  Receipt, 
  Tag, 
  Coffee, 
  Trash2 
} from 'lucide-react';

export function TransactionLedger({ 
  transactions = [], 
  currentDay = 9, 
  onDeleteTransaction, 
  onOpenAddExpense 
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'WANT' | 'NEED' | 'COMMITMENT'

  const effectiveTransactions = transactions
    .filter((tx) => tx.day <= currentDay)
    .sort((a, b) => b.day - a.day); // latest first

  const filteredList = effectiveTransactions.filter((tx) => {
    if (filter === 'ALL') return true;
    if (filter === 'WANT') return tx.tier === 'want';
    if (filter === 'NEED') return tx.tier === 'need';
    if (filter === 'COMMITMENT') return tx.tier === 'commitment';
    return true;
  });

  const wantsTotal = effectiveTransactions
    .filter((t) => t.tier === 'want')
    .reduce((a, b) => a + (Number(b.amount) || 0), 0);

  const needsTotal = effectiveTransactions
    .filter((t) => t.tier === 'need' || t.tier === 'commitment')
    .reduce((a, b) => a + (Number(b.amount) || 0), 0);

  return (
    <div className="glass-panel ledger-container">
      <div className="ledger-header">
        <div className="ledger-title-wrap">
          <div className="ledger-icon-badge">
            <Receipt size={18} />
          </div>
          <div>
            <h3 className="ledger-heading">Transaction Ledger</h3>
            <p className="ledger-subheading">
              Actual UPI and bank spends logged from Day 1 to Day {currentDay}
            </p>
          </div>
        </div>

        <button 
          className="btn-add-spend-glow"
          onClick={onOpenAddExpense}
        >
          + Log New Spend
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="ledger-filter-bar">
        <div className="ledger-pills">
          <button 
            className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Spends ({effectiveTransactions.length})
          </button>
          <button 
            className={`filter-pill ${filter === 'WANT' ? 'active' : ''}`}
            onClick={() => setFilter('WANT')}
          >
            Discretionary Wants (₹{wantsTotal})
          </button>
          <button 
            className={`filter-pill ${filter === 'NEED' ? 'active' : ''}`}
            onClick={() => setFilter('NEED')}
          >
            Essentials & Needs (₹{needsTotal})
          </button>
        </div>

        <div className="wants-ratio-badge">
          <span className="text-muted text-xs">Impulse Ratio:</span>
          <span className="mono font-semibold text-amber">
            {wantsTotal + needsTotal > 0 ? Math.round((wantsTotal / (wantsTotal + needsTotal)) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {filteredList.length === 0 ? (
          <div className="empty-ledger-state">
            <p className="text-secondary">No transactions logged under this filter for Day 1 - {currentDay}.</p>
          </div>
        ) : (
          filteredList.map((tx) => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div className={`tx-icon-wrap tier-${tx.tier || 'want'}`}>
                  {tx.tier === 'need' ? <Tag size={15} /> : <Coffee size={15} />}
                </div>
                <div>
                  <h5 className="tx-title">{tx.title}</h5>
                  <div className="tx-meta">
                    <span className="tx-day mono">Day {tx.day}</span>
                    <span className="meta-divider">•</span>
                    <span className="tx-category">{tx.category}</span>
                    {tx.notes && (
                      <>
                        <span className="meta-divider">•</span>
                        <span className="tx-notes">{tx.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="tx-right">
                <div className="tx-amount-col">
                  <span className="tx-amount mono">
                    -₹{Number(tx.amount).toLocaleString('en-IN')}
                  </span>
                  <span className={`tx-tier-badge badge-${tx.tier === 'need' ? 'cyan' : tx.tier === 'commitment' ? 'amber' : 'violet'}`}>
                    {tx.tier === 'need' ? 'Need' : tx.tier === 'commitment' ? 'Fixed Bill' : 'Impulse / Want'}
                  </span>
                </div>

                <button 
                  className="tx-delete-btn"
                  onClick={() => onDeleteTransaction(tx.id)}
                  title="Remove transaction"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
