/**
 * PULSE 30 Financial Engine
 * Calculates interconnected telemetry for Gen Z ₹10,000 / 30-day budget:
 * - Liquid balance vs locked savings vs unpaid obligations
 * - True Safe-To-Spend Daily Burn Allowance
 * - Financial Health Score (0-100)
 * - Financial Risk Level & Day 30 Cash Trajectory
 * - What-If Decision Simulation Engine
 */

export function calculateFinancialMetrics(state) {
  const currentDay = Math.min(30, Math.max(1, state.currentDay || 1));
  const remainingDays = Math.max(1, 30 - currentDay + 1);

  // 1. Incomes
  const totalIncome = (state.incomes || []).reduce((acc, inc) => acc + (Number(inc.amount) || 0), 0);

  // 2. Actual logged transactions up to current day
  const effectiveTransactions = (state.transactions || []).filter(
    (tx) => tx.day <= currentDay
  );

  const totalSpent = effectiveTransactions.reduce(
    (acc, tx) => acc + (tx.type === "expense" ? Number(tx.amount) || 0 : 0),
    0
  );

  const needsSpent = effectiveTransactions
    .filter((tx) => tx.tier === "need" || tx.tier === "commitment")
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const discretionarySpent = effectiveTransactions
    .filter((tx) => tx.tier === "want" || (!tx.tier && tx.type === "expense"))
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  // 3. Savings Vaults (Allocated money locked away)
  const totalVaultSavings = (state.savingsVaults || []).reduce(
    (acc, v) => acc + (Number(v.current) || 0),
    0
  );

  const totalVaultTargets = (state.savingsVaults || []).reduce(
    (acc, v) => acc + (Number(v.target) || 0),
    0
  );

  // 4. Liquid Cash in Account Right Now
  // Incomes - Expenses - Money Stashed in Savings Vaults
  const liquidBalance = Math.round(totalIncome - totalSpent - totalVaultSavings);

  // 5. Unpaid Fixed Commitments (Due from currentDay onwards)
  const unpaidFixedCommitments = (state.fixedCommitments || [])
    .filter((fc) => !fc.isPaid && fc.dueDay >= currentDay)
    .reduce((acc, fc) => acc + (Number(fc.amount) || 0), 0);

  // 6. Active Subscriptions (Due from currentDay onwards in current 30-day cycle)
  const unpaidSubscriptions = (state.subscriptions || [])
    .filter((sub) => sub.active && sub.dueDay >= currentDay)
    .reduce((acc, sub) => acc + (Number(sub.amount) || 0), 0);

  const totalUpcomingObligations = unpaidFixedCommitments + unpaidSubscriptions;

  // 7. True Safe-To-Spend Pool & Daily Allowance
  // The crucial Gen-Z metric: Cash left AFTER reserving for upcoming rent/bills/subs
  const safeSpendablePool = Math.max(0, liquidBalance - totalUpcomingObligations);
  const rawDailyAllowance = safeSpendablePool / remainingDays;
  const safeDailyAllowance = Math.max(0, Math.round(rawDailyAllowance));

  // 8. Daily Burn Velocity & Burn Analysis
  // Non-rent / discretionary average daily spend so far
  const dailyDiscretionaryBurn = currentDay > 1 
    ? Math.round(discretionarySpent / (currentDay - 1)) 
    : Math.round(discretionarySpent);

  // Baseline target daily spend for whole month (excluding fixed commitments)
  const totalFixedCostsMonth = (state.fixedCommitments || []).reduce((a, b) => a + Number(b.amount || 0), 0) +
    (state.subscriptions || []).filter(s => s.active).reduce((a, b) => a + Number(b.amount || 0), 0);
  const baselineDailyTarget = Math.max(1, Math.round((totalIncome - totalFixedCostsMonth - totalVaultSavings) / 30));

  // 9. Projected Day 30 Ending Balance
  // If user continues spending at current daily discretionary rate:
  const projectedDiscretionaryRemaining = dailyDiscretionaryBurn * (remainingDays - 1);
  const projectedDay30Balance = Math.round(liquidBalance - totalUpcomingObligations - projectedDiscretionaryRemaining);

  // 10. Financial Runway (in Days)
  // How many days until cash reaches ₹0 at current burn rate
  let runwayDays = remainingDays;
  const totalDailyBurn = Math.max(1, dailyDiscretionaryBurn);
  const runwayAtBurn = Math.floor(safeSpendablePool / totalDailyBurn);
  if (runwayAtBurn < remainingDays) {
    runwayDays = Math.max(1, currentDay + runwayAtBurn);
  } else {
    runwayDays = 30; // Lasts full month safely
  }

  // 11. Financial Risk Level
  let riskLevel = "LOW";
  let riskLabel = "Low Risk (Chilling)";
  let riskColor = "var(--accent-mint)";

  if (liquidBalance < totalUpcomingObligations || projectedDay30Balance < -500 || safeDailyAllowance < 40) {
    riskLevel = "CRITICAL";
    riskLabel = "Critical (Insolvency Danger)";
    riskColor = "var(--accent-rose)";
  } else if (projectedDay30Balance < 0 || safeDailyAllowance < 80 || runwayDays < 28) {
    riskLevel = "HIGH";
    riskLabel = "High Risk (Tight Runway)";
    riskColor = "var(--accent-rose-light)";
  } else if (safeDailyAllowance < 140 || projectedDay30Balance < 350) {
    riskLevel = "MODERATE";
    riskLabel = "Moderate (Watch Discretionary)";
    riskColor = "var(--accent-amber)";
  }

  // 12. Financial Health Score (0 - 100)
  // Pillar 1: Runway & Cash Buffer (30 pts)
  let p1Runway = 0;
  if (liquidBalance >= totalUpcomingObligations + 1000) p1Runway = 30;
  else if (liquidBalance >= totalUpcomingObligations + 400) p1Runway = 22;
  else if (liquidBalance >= totalUpcomingObligations) p1Runway = 15;
  else p1Runway = Math.max(0, 15 - Math.round(Math.abs(liquidBalance - totalUpcomingObligations) / 100));

  // Pillar 2: Daily Allowance Viability (25 pts)
  let p2Allowance = 0;
  if (safeDailyAllowance >= 200) p2Allowance = 25;
  else if (safeDailyAllowance >= 140) p2Allowance = 20;
  else if (safeDailyAllowance >= 90) p2Allowance = 14;
  else if (safeDailyAllowance >= 40) p2Allowance = 8;
  else p2Allowance = 2;

  // Pillar 3: Commitment & Bill Security (25 pts)
  let p3Commitments = 0;
  if (liquidBalance >= totalUpcomingObligations * 1.5) p3Commitments = 25;
  else if (liquidBalance >= totalUpcomingObligations) p3Commitments = 20;
  else if (liquidBalance >= totalUpcomingObligations * 0.75) p3Commitments = 12;
  else p3Commitments = 4;

  // Pillar 4: Savings Ratio & Goals (20 pts)
  let p4Savings = 0;
  const savingsRatio = totalIncome > 0 ? totalVaultSavings / totalIncome : 0;
  if (savingsRatio >= 0.15) p4Savings = 20;
  else if (savingsRatio >= 0.10) p4Savings = 16;
  else if (savingsRatio >= 0.05) p4Savings = 11;
  else if (totalVaultSavings > 0) p4Savings = 6;
  else p4Savings = 2;

  const healthScore = Math.min(100, Math.max(5, p1Runway + p2Allowance + p3Commitments + p4Savings));

  let healthTier = "Sigma Sovereign 👑";
  let healthTheme = "mint";
  if (healthScore < 45) {
    healthTier = "Code Red Broke 🚨";
    healthTheme = "rose";
  } else if (healthScore < 65) {
    healthTier = "Tightrope Walking ⚠️";
    healthTheme = "amber";
  } else if (healthScore < 82) {
    healthTier = "Vibe In Check ⚡";
    healthTheme = "cyan";
  }

  // 13. 30-Day Trajectory Curve Points (for graphing)
  const trajectoryPoints = generateTrajectoryCurve({
    totalIncome,
    totalSpent,
    effectiveTransactions,
    currentDay,
    liquidBalance,
    totalUpcomingObligations,
    dailyDiscretionaryBurn,
    fixedCommitments: state.fixedCommitments,
    subscriptions: state.subscriptions,
  });

  return {
    currentDay,
    remainingDays,
    totalIncome,
    totalSpent,
    needsSpent,
    discretionarySpent,
    totalVaultSavings,
    totalVaultTargets,
    liquidBalance,
    unpaidFixedCommitments,
    unpaidSubscriptions,
    totalUpcomingObligations,
    safeSpendablePool,
    safeDailyAllowance,
    baselineDailyTarget,
    dailyDiscretionaryBurn,
    projectedDay30Balance,
    runwayDays,
    riskLevel,
    riskLabel,
    riskColor,
    healthScore,
    healthTier,
    healthTheme,
    pillars: {
      runway: p1Runway,
      allowance: p2Allowance,
      commitments: p3Commitments,
      savings: p4Savings,
    },
    trajectoryPoints,
  };
}

/**
 * Generate 30-day balance trajectory with past actuals and future projections
 */
function generateTrajectoryCurve({
  totalIncome,
  effectiveTransactions,
  currentDay,
  liquidBalance,
  dailyDiscretionaryBurn,
  fixedCommitments,
  subscriptions,
}) {
  const points = [];
  let runningBalance = totalIncome;

  // Past days 1 to currentDay
  for (let d = 1; d <= currentDay; d++) {
    const daySpends = effectiveTransactions
      .filter((t) => t.day === d)
      .reduce((a, b) => a + Number(b.amount || 0), 0);
    runningBalance -= daySpends;
    points.push({
      day: d,
      actual: Math.round(runningBalance),
      projected: Math.round(runningBalance),
      isHistorical: true,
      hasCommitment: (fixedCommitments || []).some(fc => fc.dueDay === d) || (subscriptions || []).some(s => s.dueDay === d),
    });
  }

  // Future days (currentDay + 1 to 30)
  let futureBalance = liquidBalance;
  for (let d = currentDay + 1; d <= 30; d++) {
    // Check if fixed commitment due on this day
    const dueFC = (fixedCommitments || [])
      .filter((fc) => !fc.isPaid && fc.dueDay === d)
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    const dueSub = (subscriptions || [])
      .filter((s) => s.active && s.dueDay === d)
      .reduce((a, b) => a + Number(b.amount || 0), 0);

    futureBalance = futureBalance - dueFC - dueSub - dailyDiscretionaryBurn;

    points.push({
      day: d,
      actual: null,
      projected: Math.round(futureBalance),
      isHistorical: false,
      hasCommitment: dueFC + dueSub > 0,
      commitmentAmount: dueFC + dueSub,
    });
  }

  return points;
}

/**
 * What-If Decision Simulation Engine
 * Takes current state and an hypothetical decision:
 * Action Types:
 * - 'PURCHASE': { amount, title, category, tier }
 * - 'SUBSCRIPTION_TOGGLE': { subId, active }
 * - 'GIG_INCOME': { amount, source, day }
 * - 'VAULT_TRANSFER': { vaultId, amount, direction: 'DEPOSIT' | 'WITHDRAW' }
 * - 'SPENDING_CUT': { percentageCut: 30 }
 */
export function simulateDecision(currentState, action) {
  // Deep clone state to prevent mutation
  const simulatedState = JSON.parse(JSON.stringify(currentState));
  const currentMetrics = calculateFinancialMetrics(currentState);

  let simulationNarrative = "";

  switch (action.type) {
    case "PURCHASE": {
      const amount = Number(action.amount) || 0;
      simulatedState.transactions.push({
        id: "sim-tx-test",
        day: simulatedState.currentDay,
        title: action.title || "Simulated Purchase",
        category: action.category || "Discretionary",
        amount: amount,
        type: "expense",
        tier: action.tier || "want",
        simulated: true,
      });
      simulationNarrative = `Purchasing "${action.title || "Item"}" for ₹${amount.toLocaleString("en-IN")}`;
      break;
    }

    case "SUBSCRIPTION_TOGGLE": {
      const sub = simulatedState.subscriptions.find((s) => s.id === action.subId);
      if (sub) {
        sub.active = action.active;
        simulationNarrative = `${action.active ? "Resuming" : "Canceling"} ${sub.name} (₹${sub.amount}/mo)`;
      }
      break;
    }

    case "GIG_INCOME": {
      const amount = Number(action.amount) || 0;
      simulatedState.incomes.push({
        id: "sim-inc-test",
        day: simulatedState.currentDay,
        source: action.source || "Freelance / Gig",
        category: "Gig",
        amount: amount,
        recurring: false,
        simulated: true,
      });
      simulationNarrative = `Adding ₹${amount.toLocaleString("en-IN")} income from "${action.source || "Side Gig"}"`;
      break;
    }

    case "VAULT_TRANSFER": {
      const vault = simulatedState.savingsVaults.find((v) => v.id === action.vaultId);
      const amount = Number(action.amount) || 0;
      if (vault) {
        if (action.direction === "DEPOSIT") {
          vault.current += amount;
          simulationNarrative = `Locking ₹${amount} into "${vault.name}" vault`;
        } else {
          vault.current = Math.max(0, vault.current - amount);
          simulationNarrative = `Withdrawing ₹${amount} from "${vault.name}" back into liquid cash`;
        }
      }
      break;
    }

    case "SPENDING_CUT": {
      // Simulate cutting daily discretionary spend for remaining days
      simulationNarrative = `Reducing daily discretionary burn by ${action.percentageCut}%`;
      break;
    }

    default:
      break;
  }

  const simulatedMetrics = calculateFinancialMetrics(simulatedState);

  // If spending cut was requested, adjust the simulated projected day 30 metrics directly
  if (action.type === "SPENDING_CUT") {
    const cutRatio = (Number(action.percentageCut) || 20) / 100;
    const oldBurn = currentMetrics.dailyDiscretionaryBurn;
    const newBurn = Math.round(oldBurn * (1 - cutRatio));
    const savedAcrossDays = (oldBurn - newBurn) * (simulatedMetrics.remainingDays - 1);
    simulatedMetrics.dailyDiscretionaryBurn = newBurn;
    simulatedMetrics.projectedDay30Balance += savedAcrossDays;
  }

  // Calculate Deltas
  const liquidBalanceDelta = simulatedMetrics.liquidBalance - currentMetrics.liquidBalance;
  const dailyAllowanceDelta = simulatedMetrics.safeDailyAllowance - currentMetrics.safeDailyAllowance;
  const healthScoreDelta = simulatedMetrics.healthScore - currentMetrics.healthScore;
  const projectedDay30Delta = simulatedMetrics.projectedDay30Balance - currentMetrics.projectedDay30Balance;
  const runwayDelta = simulatedMetrics.runwayDays - currentMetrics.runwayDays;

  // Generate Gen-Z FinTech AI Feedback
  const aiAdvisorInsight = generateAdvisorFeedback({
    action,
    currentMetrics,
    simulatedMetrics,
    liquidBalanceDelta,
    dailyAllowanceDelta,
    healthScoreDelta,
    projectedDay30Delta,
  });

  return {
    simulatedState,
    currentMetrics,
    simulatedMetrics,
    simulationNarrative,
    deltas: {
      liquidBalanceDelta,
      dailyAllowanceDelta,
      healthScoreDelta,
      projectedDay30Delta,
      runwayDelta,
    },
    aiAdvisorInsight,
  };
}

/**
 * Generate conversational Gen Z financial advisor feedback
 */
function generateAdvisorFeedback({
  action,
  currentMetrics,
  simulatedMetrics,
  liquidBalanceDelta,
  dailyAllowanceDelta,
  healthScoreDelta,
  projectedDay30Delta,
}) {
  const isPurchase = action.type === "PURCHASE";
  const isIncome = action.type === "GIG_INCOME";
  const isSub = action.type === "SUBSCRIPTION_TOGGLE";
  const isVault = action.type === "VAULT_TRANSFER";

  if (isPurchase) {
    if (simulatedMetrics.projectedDay30Balance < 0) {
      return {
        tone: "alarm",
        title: "🚨 Deficit Warning: You'll Run Out of Money!",
        summary: `Swiping ₹${Math.abs(liquidBalanceDelta).toLocaleString("en-IN")} now drops your daily allowance from ₹${currentMetrics.safeDailyAllowance}/day to ₹${simulatedMetrics.safeDailyAllowance}/day.`,
        detail: `At this rate, your bank balance will flip negative by Day ${simulatedMetrics.runwayDays}. Your upcoming bills (mobile & wifi) will be in danger. Consider applying the 48-Hour Rule before confirming!`,
        actionableTip: "Postpone this purchase by 5 days or take a quick freelance micro-gig to offset it.",
      };
    } else if (dailyAllowanceDelta < -40) {
      return {
        tone: "caution",
        title: "⚠️ Big Pinch on Daily Freedom",
        summary: `This spend cuts ₹${Math.abs(dailyAllowanceDelta)}/day from your safe-to-spend allowance for the next ${currentMetrics.remainingDays} days.`,
        detail: `You'll have only ₹${simulatedMetrics.safeDailyAllowance}/day left for food, chai, and cabs. Your health score drops by ${Math.abs(healthScoreDelta)} points.`,
        actionableTip: "If you really need this, consider cutting Swiggy orders by 30% to maintain your buffer.",
      };
    } else {
      return {
        tone: "good",
        title: "✅ Safe to Swipe! Budget Intact",
        summary: `You have sufficient buffer. Your daily allowance remains healthy at ₹${simulatedMetrics.safeDailyAllowance}/day.`,
        detail: `Upcoming rent & utility commitments remain 100% funded, and your health score only shifts slightly.`,
        actionableTip: "Go ahead! Remember to log the UPI receipt to keep your dashboard accurate.",
      };
    }
  }

  if (isIncome) {
    return {
      tone: "great",
      title: "🚀 Massive Vibe Boost! Runway Expanded",
      summary: `Adding ₹${liquidBalanceDelta.toLocaleString("en-IN")} boosts your daily allowance by +₹${dailyAllowanceDelta}/day!`,
      detail: `Your projected Day 30 balance increases to ₹${simulatedMetrics.projectedDay30Balance.toLocaleString("en-IN")}, and your financial health score surges by +${healthScoreDelta} points.`,
      actionableTip: "Smart move: Allocate 50% of this gig income into your Emergency Shield vault to lock in long-term safety.",
    };
  }

  if (isSub) {
    if (!action.active) {
      return {
        tone: "good",
        title: "💡 Subscription Paused: Instant Breathing Room",
        summary: `You just freed up extra cash for the remaining ${currentMetrics.remainingDays} days.`,
        detail: `Your daily safe spend nudges up by +₹${dailyAllowanceDelta}/day and your Day 30 forecast improves. Small leaks stopped = big month-end freedom.`,
        actionableTip: "You can always re-activate next month when your new stipend hits.",
      };
    } else {
      return {
        tone: "neutral",
        title: "🔄 Subscription Activated",
        summary: `This commitment has been factored into your upcoming monthly dues.`,
        detail: `Safe daily allowance adjusted to ₹${simulatedMetrics.safeDailyAllowance}/day.`,
        actionableTip: "Ensure auto-pay date doesn't clash with rent day.",
      };
    }
  }

  if (isVault) {
    if (action.direction === "DEPOSIT") {
      return {
        tone: "good",
        title: "🛡️ Capital Locked in Vault!",
        summary: `Secured money away from impulse swiping temptation.`,
        detail: `While liquid cash is reduced, your resilience score and savings pillar gain strength.`,
        actionableTip: "Locked funds protect you from lifestyle creep.",
      };
    } else {
      return {
        tone: "caution",
        title: "⚠️ Vault Liquidated",
        summary: `Money transferred back into spendable cash.`,
        detail: `Gives temporary daily liquidity (+₹${dailyAllowanceDelta}/day), but reduces your emergency protection.`,
        actionableTip: "Only use emergency vault withdrawals for genuine crises, not weekend club entries.",
      };
    }
  }

  return {
    tone: "neutral",
    title: "Simulation Analysis",
    summary: `Simulation evaluated across 30 days.`,
    detail: `Daily allowance shifts by ₹${dailyAllowanceDelta}/day.`,
    actionableTip: "Compare before vs after metrics below.",
  };
}
