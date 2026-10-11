import React, { useState } from 'react';
import { 
  Dices, 
  ShieldAlert, 
  AlertCircle, 
  Sparkles,
  CloudRain,
  Gift,
  Wrench,
  Smartphone,
  Activity,
  FileText
} from 'lucide-react';
import { UNEXPECTED_SHOCK_TEMPLATES } from '../data/initialData';

const iconMap = {
  CloudRain,
  Gift,
  Wrench,
  Smartphone,
  Activity,
  FileText,
};

export function UnexpectedShockRoulette({ 
  currentMetrics, 
  onApplyShock, 
  emergencyVaultBalance = 0 
}) {
  const [selectedShock, setSelectedShock] = useState(UNEXPECTED_SHOCK_TEMPLATES[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomDraw = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * UNEXPECTED_SHOCK_TEMPLATES.length);
      setSelectedShock(UNEXPECTED_SHOCK_TEMPLATES[randIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  };

  const IconComponent = iconMap[selectedShock.icon] || AlertCircle;
  const canVaultAbsorb = emergencyVaultBalance >= selectedShock.amount;
  const remainingDays = Math.max(1, currentMetrics.remainingDays);
  const dailyHit = Math.round(selectedShock.amount / remainingDays);
  const newDailyAllowance = Math.max(0, currentMetrics.safeDailyAllowance - dailyHit);

  return (
    <div className="glass-panel shock-card-container">
      <div className="shock-header">
        <div className="shock-title-wrap">
          <div className="shock-icon-wrap">
            <Dices size={18} />
          </div>
          <div>
            <h3 className="shock-title">Life Happens: Unexpected Expense Deck</h3>
            <p className="shock-subtitle">
              Test your financial resilience against sudden Gen Z reality checks
            </p>
          </div>
        </div>

        <button 
          className="btn-roulette-spin" 
          onClick={handleRandomDraw}
          disabled={isSpinning}
        >
          <Dices size={15} className={isSpinning ? 'animate-spin' : ''} />
          <span>Draw Random Shock</span>
        </button>
      </div>

      {/* Selected Shock Card */}
      <div className="shock-selected-box">
        <div className="shock-meta-row">
          <div className="shock-badge-group">
            <div className="shock-type-icon">
              <IconComponent size={20} />
            </div>
            <div>
              <h4 className="shock-name">{selectedShock.title}</h4>
              <span className="shock-category-tag">{selectedShock.category}</span>
            </div>
          </div>

          <div className="shock-amount-wrap">
            <span className="shock-cost-label">Sudden Cost:</span>
            <span className="shock-cost-val mono text-rose">₹{selectedShock.amount}</span>
          </div>
        </div>

        <p className="shock-description">{selectedShock.description}</p>

        {/* Resilience Impact Preview */}
        <div className="shock-impact-row">
          <div className="shock-impact-item">
            <span className="impact-label">Hit to Daily Allowance:</span>
            <span className="impact-val mono text-rose">
              -₹{dailyHit}/day (Drops to ₹{newDailyAllowance}/d)
            </span>
          </div>

          <div className="shock-impact-item">
            <span className="impact-label">Emergency Vault Buffer:</span>
            <span className={`impact-val mono ${canVaultAbsorb ? 'text-mint' : 'text-amber'}`}>
              ₹{emergencyVaultBalance} available {canVaultAbsorb ? '(100% Covers this!)' : '(Insufficient)'}
            </span>
          </div>
        </div>

        <div className="shock-advice-banner">
          <Sparkles size={14} className="text-violet" />
          <span>{selectedShock.advice}</span>
        </div>

        {/* Resolution Options */}
        <div className="shock-actions-row">
          <button
            className="btn-absorb-vault"
            onClick={() => onApplyShock(selectedShock, 'VAULT')}
            disabled={!canVaultAbsorb}
            title={canVaultAbsorb ? "Use Emergency Vault to protect daily allowance" : "Not enough money in emergency vault"}
          >
            <ShieldAlert size={15} />
            <span>Absorb with Emergency Vault (Keep ₹{currentMetrics.safeDailyAllowance}/d)</span>
          </button>

          <button
            className="btn-absorb-allowance"
            onClick={() => onApplyShock(selectedShock, 'ALLOWANCE')}
            title="Take the hit out of monthly discretionary cash"
          >
            <span>Absorb via Cash (-₹{selectedShock.amount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
