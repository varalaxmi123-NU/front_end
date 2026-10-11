import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Headphones, 
  Sparkles, 
  Plus, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Lock, 
  Unlock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const vaultIcons = {
  ShieldAlert,
  Headphones,
  Sparkles,
};

export function SavingsVaults({ 
  savingsVaults = [], 
  liquidBalance = 0,
  onTransferToVault,
  onCreateVault 
}) {
  const [showNewVaultModal, setShowNewVaultModal] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState(1500);

  const totalSaved = savingsVaults.reduce((acc, v) => acc + (Number(v.current) || 0), 0);
  const totalTarget = savingsVaults.reduce((acc, v) => acc + (Number(v.target) || 0), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleQuickStash = (vaultId, amount) => {
    if (liquidBalance < amount) {
      alert("Not enough liquid cash in account to stash this amount!");
      return;
    }
    onTransferToVault(vaultId, amount, 'DEPOSIT');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const handleWithdraw = (vaultId, amount) => {
    onTransferToVault(vaultId, amount, 'WITHDRAW');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newVaultName.trim()) return;
    onCreateVault({
      name: newVaultName,
      target: Number(newVaultTarget) || 1000,
      current: 0,
      color: "#8B5CF6",
      icon: "Sparkles",
      description: "Custom Gen-Z goal",
      locked: false,
    });
    setNewVaultName('');
    setShowNewVaultModal(false);
  };

  return (
    <div className="glass-panel vaults-container">
      <div className="vaults-header">
        <div className="vaults-title-wrap">
          <div className="vaults-icon-badge">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="vaults-heading">Savings Vaults & Target Goals</h3>
            <p className="vaults-subheading">
              ₹{totalSaved.toLocaleString('en-IN')} total vaulted across goals ({overallProgress}% complete)
            </p>
          </div>
        </div>

        <button 
          className="btn-create-vault"
          onClick={() => setShowNewVaultModal(true)}
        >
          <Plus size={15} />
          <span>New Goal Vault</span>
        </button>
      </div>

      {/* Grid of Vault Cards */}
      <div className="vaults-grid">
        {savingsVaults.map((vault) => {
          const Icon = vaultIcons[vault.icon] || Sparkles;
          const progressPercent = Math.min(100, Math.round((vault.current / Math.max(1, vault.target)) * 100));
          const isTargetReached = vault.current >= vault.target;

          return (
            <div key={vault.id} className="vault-card">
              <div className="vault-card-top">
                <div className="vault-avatar" style={{ backgroundColor: `${vault.color}22`, color: vault.color }}>
                  <Icon size={18} />
                </div>
                <div className="vault-status-chip">
                  {vault.locked ? (
                    <span className="badge badge-mint">
                      <Lock size={11} /> Locked Shield
                    </span>
                  ) : (
                    <span className="badge badge-violet">
                      <Unlock size={11} /> Flexible
                    </span>
                  )}
                </div>
              </div>

              <div className="vault-details">
                <h4 className="vault-name">{vault.name}</h4>
                <p className="vault-desc">{vault.description}</p>
              </div>

              <div className="vault-progress-section">
                <div className="vault-numbers-row">
                  <span className="vault-current mono">₹{vault.current.toLocaleString('en-IN')}</span>
                  <span className="vault-target mono">Target: ₹{vault.target.toLocaleString('en-IN')}</span>
                </div>
                <div className="vault-progress-track">
                  <div 
                    className="vault-progress-bar"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundColor: vault.color,
                      boxShadow: `0 0 10px ${vault.color}88`
                    }}
                  />
                </div>
                <div className="vault-progress-pct mono text-xs">
                  {progressPercent}% Achieved {isTargetReached && "🎉 Goal Met!"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="vault-actions">
                <div className="quick-stash-btns">
                  <button 
                    className="btn-stash-chip"
                    onClick={() => handleQuickStash(vault.id, 100)}
                    disabled={liquidBalance < 100}
                    title="Lock ₹100 from liquid balance into this vault"
                  >
                    +₹100
                  </button>
                  <button 
                    className="btn-stash-chip"
                    onClick={() => handleQuickStash(vault.id, 250)}
                    disabled={liquidBalance < 250}
                    title="Lock ₹250 from liquid balance into this vault"
                  >
                    +₹250
                  </button>
                  <button 
                    className="btn-stash-chip"
                    onClick={() => handleQuickStash(vault.id, 500)}
                    disabled={liquidBalance < 500}
                    title="Lock ₹500 from liquid balance into this vault"
                  >
                    +₹500
                  </button>
                </div>

                {vault.current > 0 && !vault.locked && (
                  <button 
                    className="btn-vault-withdraw"
                    onClick={() => handleWithdraw(vault.id, Math.min(250, vault.current))}
                    title="Transfer ₹250 back to spendable liquid cash"
                  >
                    <ArrowDownLeft size={13} />
                    <span>Withdraw ₹250</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for creating a new goal */}
      {showNewVaultModal && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-card animate-slide-up">
            <h3 className="modal-title">Create New Savings Vault</h3>
            <p className="modal-desc">
              Ringfence your cash for something that matters to you.
            </p>
            <form onSubmit={handleCreateSubmit} className="modal-form">
              <div className="sim-input-group">
                <label>Goal Name</label>
                <input 
                  type="text" 
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  placeholder="e.g. Goa Trip, New Keyboard, Emergency Fund"
                  required
                />
              </div>

              <div className="sim-input-group">
                <label>Target Amount (₹)</label>
                <input 
                  type="number" 
                  min="300"
                  max="10000"
                  step="100"
                  value={newVaultTarget}
                  onChange={(e) => setNewVaultTarget(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-commit-action">
                  Create Vault
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowNewVaultModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
