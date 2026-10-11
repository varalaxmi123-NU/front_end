import React, { useState } from 'react';
import './App.css';
import { 
  INITIAL_FINANCIAL_STATE 
} from './data/initialData';
import { 
  calculateFinancialMetrics, 
  simulateDecision 
} from './utils/financeEngine';

import { Navbar } from './components/Navbar';
import { SimulationBanner } from './components/SimulationBanner';
import { TimelineScrubber } from './components/TimelineScrubber';
import { HeroMetrics } from './components/HeroMetrics';
import { FinancialHealthWidget } from './components/FinancialHealthWidget';
import { TrajectoryChart } from './components/TrajectoryChart';
import { DecisionSimulator } from './components/DecisionSimulator';
import { InnovationSuite } from './components/InnovationSuite';
import { UnexpectedShockRoulette } from './components/UnexpectedShockRoulette';
import { CommitmentsAndSubs } from './components/CommitmentsAndSubs';
import { SavingsVaults } from './components/SavingsVaults';
import { TransactionLedger } from './components/TransactionLedger';
import { AddExpenseModal } from './components/AddExpenseModal';
import { PulseCopilot } from './components/PulseCopilot';

import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessChime, playClick, playWarningSound } from './utils/audioEffects';

export function App() {
  const [financialState, setFinancialState] = useState(INITIAL_FINANCIAL_STATE);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Active simulated decision state for full-dashboard live cascade
  const [activeSimulation, setActiveSimulation] = useState(null); // { action, result }
  const [isGlobalPreviewActive, setIsGlobalPreviewActive] = useState(false);

  // Compute live actual metrics
  const actualMetrics = calculateFinancialMetrics(financialState);

  // Compute simulated metrics if a simulation is active
  let simulatedMetrics = null;
  let simulatedTrajectoryPoints = null;

  if (activeSimulation && activeSimulation.result) {
    simulatedMetrics = activeSimulation.result.simulatedMetrics;
    simulatedTrajectoryPoints = simulatedMetrics.trajectoryPoints;
  }

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Day timeline scrubber change
  const handleDayChange = (newDay) => {
    playClick();
    setFinancialState((prev) => ({
      ...prev,
      currentDay: newDay,
    }));
  };

  // Preset Scenario Switcher
  const handleSelectPreset = (presetId) => {
    setIsGlobalPreviewActive(false);
    setActiveSimulation(null);

    if (presetId === 'preset-day1') {
      setFinancialState({
        ...INITIAL_FINANCIAL_STATE,
        currentDay: 1,
        transactions: [],
        fixedCommitments: INITIAL_FINANCIAL_STATE.fixedCommitments.map(c => ({
          ...c,
          isPaid: false,
          paidDay: null,
        })),
        savingsVaults: INITIAL_FINANCIAL_STATE.savingsVaults.map(v => ({
          ...v,
          current: 0,
        })),
      });
      playSuccessChime();
      showToast("Loaded Scenario: Day 1 Fresh ₹10,000 Stipend!");
    } else if (presetId === 'preset-danger') {
      // Day 18 Overspender
      setFinancialState({
        ...INITIAL_FINANCIAL_STATE,
        currentDay: 18,
        transactions: [
          ...INITIAL_FINANCIAL_STATE.transactions,
          { id: "tx-ov1", day: 11, title: "Club VIP Entry & Drinks", category: "Social", amount: 1650, type: "expense", tier: "want" },
          { id: "tx-ov2", day: 13, title: "Trendy Sneaker Impulse", category: "Shopping", amount: 2100, type: "expense", tier: "want" },
          { id: "tx-ov3", day: 15, title: "Swiggy Late Nights x 4", category: "Food & Groceries", amount: 980, type: "expense", tier: "want" },
        ],
        fixedCommitments: INITIAL_FINANCIAL_STATE.fixedCommitments.map(c => ({
          ...c,
          isPaid: c.dueDay <= 14,
        })),
      });
      playWarningSound();
      showToast("Loaded Scenario: Day 18 Party Overspender (High Deficit Risk)");
    } else if (presetId === 'preset-saver') {
      // Day 22 Frugal Sigma
      setFinancialState({
        ...INITIAL_FINANCIAL_STATE,
        currentDay: 22,
        savingsVaults: [
          { ...INITIAL_FINANCIAL_STATE.savingsVaults[0], current: 1100 },
          { ...INITIAL_FINANCIAL_STATE.savingsVaults[1], current: 1500 },
          { ...INITIAL_FINANCIAL_STATE.savingsVaults[2], current: 800 },
        ],
        fixedCommitments: INITIAL_FINANCIAL_STATE.fixedCommitments.map(c => ({
          ...c,
          isPaid: c.dueDay <= 22,
        })),
      });
      playSuccessChime();
      showToast("Loaded Scenario: Day 22 The Frugal Sigma (92 Health Score)");
    } else {
      // Default / Mid-month
      setFinancialState(INITIAL_FINANCIAL_STATE);
      playClick();
      showToast("Loaded Scenario: Day 9 Mid-Month Realist");
    }
  };

  // Reset to default
  const handleResetData = () => {
    setFinancialState(INITIAL_FINANCIAL_STATE);
    setActiveSimulation(null);
    setIsGlobalPreviewActive(false);
    showToast("Dashboard reset to default ₹10,000 cycle.");
  };

  // Live simulation update broadcast from simulator
  const handleLiveSimulate = (action, simResult) => {
    setActiveSimulation({ action, result: simResult });
    setIsGlobalPreviewActive(true);
  };

  // Commit decision from Decision Simulator or Banner
  const handleCommitDecision = (actionToCommit) => {
    const action = actionToCommit || activeSimulation?.action;
    if (!action) return;

    if (action.type === 'PURCHASE') {
      const newTx = {
        id: `tx-${Date.now()}`,
        day: financialState.currentDay,
        title: action.title,
        category: action.category,
        amount: Number(action.amount),
        type: 'expense',
        tier: action.tier || 'want',
        notes: 'Committed via Decision Simulator',
      };
      setFinancialState((prev) => ({
        ...prev,
        transactions: [newTx, ...prev.transactions],
      }));
      showToast(`Committed: ${action.title} (-₹${action.amount}) added to ledger.`);
    } else if (action.type === 'SUBSCRIPTION_TOGGLE') {
      setFinancialState((prev) => ({
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          s.id === action.subId ? { ...s, active: action.active } : s
        ),
      }));
      showToast(`Subscription status updated.`);
    } else if (action.type === 'GIG_INCOME') {
      const newInc = {
        id: `inc-${Date.now()}`,
        day: financialState.currentDay,
        source: action.source,
        category: 'Gig',
        amount: Number(action.amount),
        recurring: false,
      };
      setFinancialState((prev) => ({
        ...prev,
        incomes: [...prev.incomes, newInc],
      }));
      showToast(`Gig Inflow: +₹${action.amount} added to your balance!`);
    } else if (action.type === 'VAULT_TRANSFER') {
      setFinancialState((prev) => ({
        ...prev,
        savingsVaults: prev.savingsVaults.map((v) => {
          if (v.id === action.vaultId) {
            const delta = action.direction === 'DEPOSIT' ? Number(action.amount) : -Number(action.amount);
            return { ...v, current: Math.max(0, v.current + delta) };
          }
          return v;
        }),
      }));
      showToast(`Vault transfer completed.`);
    }

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    playSuccessChime();

    setIsSimulatorOpen(false);
    setIsGlobalPreviewActive(false);
    setActiveSimulation(null);
  };

  const handleCancelPreview = () => {
    playClick();
    setIsGlobalPreviewActive(false);
    setActiveSimulation(null);
    showToast("Exited simulation preview mode.");
  };

  // Subscription Toggle
  const handleToggleSubscription = (subId, active) => {
    playClick();
    setFinancialState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === subId ? { ...s, active } : s
      ),
    }));
    showToast(`Subscription ${active ? "activated" : "paused"}. Safe daily allowance recalculated!`);
  };

  // Pay Fixed Commitment
  const handlePayCommitment = (fcId) => {
    const item = financialState.fixedCommitments.find((f) => f.id === fcId);
    if (!item) return;

    if (actualMetrics.liquidBalance < item.amount) {
      alert("Insufficient liquid balance to pay this commitment right now!");
      return;
    }

    const newTx = {
      id: `tx-bill-${Date.now()}`,
      day: financialState.currentDay,
      title: `${item.name} Payment`,
      category: item.category,
      amount: item.amount,
      type: "expense",
      tier: "commitment",
      notes: "Fixed bill cleared",
    };

    setFinancialState((prev) => ({
      ...prev,
      fixedCommitments: prev.fixedCommitments.map((fc) =>
        fc.id === fcId ? { ...fc, isPaid: true, paidDay: prev.currentDay } : fc
      ),
      transactions: [newTx, ...prev.transactions],
    }));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    playSuccessChime();

    showToast(`Paid ${item.name} (₹${item.amount}). Protected!`);
  };

  // Vault transfers
  const handleTransferToVault = (vaultId, amount, direction) => {
    setFinancialState((prev) => ({
      ...prev,
      savingsVaults: prev.savingsVaults.map((v) => {
        if (v.id === vaultId) {
          const delta = direction === 'DEPOSIT' ? amount : -amount;
          return { ...v, current: Math.max(0, v.current + delta) };
        }
        return v;
      }),
    }));
    playSuccessChime();
    showToast(direction === 'DEPOSIT' ? `₹${amount} locked into vault!` : `₹${amount} returned to liquid cash.`);
  };

  // Create new goal vault
  const handleCreateVault = (newVault) => {
    const vaultWithId = {
      ...newVault,
      id: `vault-${Date.now()}`,
    };
    setFinancialState((prev) => ({
      ...prev,
      savingsVaults: [...prev.savingsVaults, vaultWithId],
    }));
    playSuccessChime();
    showToast(`Created new vault: ${newVault.name}!`);
  };

  // Add new logged spend
  const handleAddExpense = (expenseData) => {
    const newTx = {
      ...expenseData,
      id: `tx-${Date.now()}`,
    };
    setFinancialState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    playClick();
    showToast(`Logged spend: ${expenseData.title} (-₹${expenseData.amount})`);
  };

  // Delete transaction
  const handleDeleteTransaction = (txId) => {
    setFinancialState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== txId),
    }));
    playClick();
    showToast("Transaction removed. Balance restored.");
  };

  // Apply unexpected shock
  const handleApplyShock = (shock, method) => {
    if (method === 'VAULT') {
      setFinancialState((prev) => ({
        ...prev,
        savingsVaults: prev.savingsVaults.map((v) =>
          v.id === 'vault-1' ? { ...v, current: Math.max(0, v.current - shock.amount) } : v
        ),
      }));
      playSuccessChime();
      showToast(`Shock absorbed! ₹${shock.amount} deducted from Emergency Shield. Daily allowance shielded.`);
    } else {
      const shockTx = {
        id: `shock-${Date.now()}`,
        day: financialState.currentDay,
        title: `⚡ ${shock.title}`,
        category: shock.category,
        amount: shock.amount,
        type: 'expense',
        tier: 'need',
        notes: shock.description,
      };
      setFinancialState((prev) => ({
        ...prev,
        transactions: [shockTx, ...prev.transactions],
      }));
      playWarningSound();
      showToast(`Shock applied: ₹${shock.amount} deducted from discretionary pool.`);
    }
  };

  // Quick simulate from Copilot
  const handleQuickSimulate = (actionType, payload) => {
    const action = { type: actionType, ...payload };
    const res = simulateDecision(financialState, action);
    handleLiveSimulate(action, res);
    setIsSimulatorOpen(true);
  };

  const emergencyVault = financialState.savingsVaults.find((v) => v.id === 'vault-1')?.current || 0;

  return (
    <div className="app-root">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">Skip to main financial dashboard</a>

      {/* Top Navbar with Presets & Quick Actions */}
      <Navbar
        currentDay={financialState.currentDay}
        onSelectPreset={handleSelectPreset}
        onResetData={handleResetData}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        isSimulating={isGlobalPreviewActive}
      />

      {/* Persistent Global Simulation Banner when Previewing */}
      {isGlobalPreviewActive && activeSimulation && (
        <SimulationBanner
          simulationNarrative={activeSimulation.result.simulationNarrative}
          deltas={activeSimulation.result.deltas}
          currentMetrics={actualMetrics}
          simulatedMetrics={simulatedMetrics}
          onCommit={() => handleCommitDecision()}
          onCancel={handleCancelPreview}
        />
      )}

      <main id="main-content" className="main-content" tabIndex="-1" role="main">
        {/* 1. Interactive 30-Day Timeline Scrubber */}
        <TimelineScrubber
          currentDay={financialState.currentDay}
          totalDays={financialState.totalDays}
          onDayChange={handleDayChange}
          fixedCommitments={financialState.fixedCommitments}
        />

        {/* 2. Primary Telemetry Cards (Liquid Cash, Safe Daily Allowance, Obligations, Forecast) */}
        <HeroMetrics
          metrics={actualMetrics}
          simulatedMetrics={simulatedMetrics}
          isSimulating={isGlobalPreviewActive}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 3. Middle Core: Financial Health Gauge & 30-Day Trajectory Curve */}
        <div className="middle-dashboard-grid">
          <FinancialHealthWidget 
            metrics={actualMetrics} 
            simulatedMetrics={simulatedMetrics}
            isSimulating={isGlobalPreviewActive}
          />
          <TrajectoryChart
            trajectoryPoints={actualMetrics.trajectoryPoints}
            currentDay={financialState.currentDay}
            totalDays={financialState.totalDays}
            simulatedTrajectoryPoints={simulatedTrajectoryPoints}
            isSimulating={isGlobalPreviewActive}
          />
        </div>

        {/* 4. Embedded Decision Sandbox */}
        <DecisionSimulator
          currentState={financialState}
          onCommitDecision={handleCommitDecision}
          onLiveSimulate={handleLiveSimulate}
          isModal={false}
        />

        {/* 5. Innovation Suite: 50/30/20 Cashflow Allocation Donut & 48h Wishlist */}
        <InnovationSuite
          metrics={actualMetrics}
          financialState={financialState}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 6. AI Copilot Strategist */}
        <PulseCopilot
          metrics={isGlobalPreviewActive && simulatedMetrics ? simulatedMetrics : actualMetrics}
          onQuickSimulate={handleQuickSimulate}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* 7. Fixed Commitments & Subscriptions Manager */}
        <CommitmentsAndSubs
          fixedCommitments={financialState.fixedCommitments}
          subscriptions={financialState.subscriptions}
          currentDay={financialState.currentDay}
          remainingDays={actualMetrics.remainingDays}
          onToggleSubscription={handleToggleSubscription}
          onPayCommitment={handlePayCommitment}
        />

        {/* 7. Savings Vaults & Target Goals */}
        <SavingsVaults
          savingsVaults={financialState.savingsVaults}
          liquidBalance={actualMetrics.liquidBalance}
          onTransferToVault={handleTransferToVault}
          onCreateVault={handleCreateVault}
        />

        {/* 8. Unexpected Shock Roulette */}
        <UnexpectedShockRoulette
          currentMetrics={actualMetrics}
          onApplyShock={handleApplyShock}
          emergencyVaultBalance={emergencyVault}
        />

        {/* 9. Transaction Ledger & UPI Log */}
        <TransactionLedger
          transactions={financialState.transactions}
          currentDay={financialState.currentDay}
          onDeleteTransaction={handleDeleteTransaction}
          onOpenAddExpense={() => setIsAddExpenseOpen(true)}
        />
      </main>

      {/* Decision Simulator Modal (when triggered via top header) */}
      {isSimulatorOpen && (
        <div className="modal-backdrop">
          <DecisionSimulator
            currentState={financialState}
            onCommitDecision={handleCommitDecision}
            onLiveSimulate={handleLiveSimulate}
            onClose={() => setIsSimulatorOpen(false)}
            isModal={true}
          />
        </div>
      )}

      {/* Log Spend Modal */}
      {isAddExpenseOpen && (
        <AddExpenseModal
          currentDay={financialState.currentDay}
          onAddExpense={handleAddExpense}
          onClose={() => setIsAddExpenseOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner animate-slide-up">
          <CheckCircle2 size={16} className="text-mint" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
