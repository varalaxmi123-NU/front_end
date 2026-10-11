import React, { useState } from 'react';
import { X, Plus, Sparkles, Tag } from 'lucide-react';

export function AddExpenseModal({ 
  currentDay, 
  onAddExpense, 
  onClose 
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [tier, setTier] = useState('want');
  const [day, setDay] = useState(currentDay);
  const [notes, setNotes] = useState('');

  const categories = [
    'Food & Dining',
    'Groceries',
    'Transit / Metro',
    'Social & Nightout',
    'Shopping & Fashion',
    'Education & Books',
    'Health & Wellness',
    'Utilities',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onAddExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      tier,
      day: Number(day) || currentDay,
      notes: notes.trim(),
      type: 'expense',
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel modal-card animate-slide-up">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="modal-title">Log New Expense</h3>
              <p className="modal-desc">Record actual UPI spend into your 30-day ledger</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="sim-input-group">
            <label>Expense Name / Payee</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Swiggy Lunch, Metro Card, Cafe Coffee"
              required
              autoFocus
            />
          </div>

          <div className="modal-two-col">
            <div className="sim-input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="10"
                max="10000"
                step="5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹250"
                required
              />
            </div>

            <div className="sim-input-group">
              <label>Day (1 - 30)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="sim-input-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sim-input-group">
            <label>Spend Type</label>
            <div className="tier-toggle-group">
              <button
                type="button"
                className={`tier-toggle-btn ${tier === 'want' ? 'active want' : ''}`}
                onClick={() => setTier('want')}
              >
                Discretionary Want
              </button>
              <button
                type="button"
                className={`tier-toggle-btn ${tier === 'need' ? 'active need' : ''}`}
                onClick={() => setTier('need')}
              >
                Essential Need
              </button>
            </div>
          </div>

          <div className="sim-input-group">
            <label>Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Split with Rohan, Exam week snack"
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-commit-action">
              Add Expense
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
