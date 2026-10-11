import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  Zap, 
  Send, 
  MessageSquare, 
  Compass 
} from 'lucide-react';
import { playClick, playSuccessChime } from '../utils/audioEffects';

export function PulseCopilot({ metrics, onQuickSimulate, onOpenSimulator }) {
  const {
    safeDailyAllowance,
    dailyDiscretionaryBurn,
    remainingDays,
    liquidBalance,
    totalUpcomingObligations,
    projectedDay30Balance,
    healthScore,
    riskLevel,
    currentDay
  } = metrics;

  const [activeView, setActiveView] = useState('chat'); // 'chat' | 'strategies' | 'triage'
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hey! I'm **PULSE AI**, your personal financial co-pilot for your ₹10K month. Right now on Day ${currentDay}, your safe burn limit is **₹${safeDailyAllowance}/day** with ₹${liquidBalance.toLocaleString('en-IN')} in your bank. What financial move are you thinking of making?`,
      time: 'Just now',
      action: null
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const msgCounterRef = useRef(100);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Pre-configured Gen Z smart prompt suggestions
  const suggestedQuestions = [
    {
      label: "Can I afford ₹850 dinner with friends?",
      query: "Can I afford ₹850 dinner with friends tonight?"
    },
    {
      label: "How do I increase my daily allowance?",
      query: "How do I increase my daily safe spend limit?"
    },
    {
      label: "What is my biggest financial risk right now?",
      query: "What is my biggest financial risk right now?"
    },
    {
      label: "Give me an emergency recovery plan",
      query: "Give me a plan to finish the month with ₹1,000+ saved"
    }
  ];

  // AI Response Generator based on live budget metrics
  const generateAiReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes('dinner') || q.includes('850') || q.includes('party') || q.includes('afford')) {
      const remainingSafe = safeDailyAllowance;
      const hitPerDay = Math.round(850 / remainingDays);
      const newDaily = Math.max(0, safeDailyAllowance - hitPerDay);

      return {
        text: `**Vibe Check on ₹850 spend:**\n\nSwiping ₹850 will take **₹${hitPerDay}/day** out of your daily freedom for the remaining **${remainingDays} days**, lowering your limit from **₹${remainingSafe}/day** to **₹${newDaily}/day**.\n\n${newDaily < 80 ? '⚠️ **Warning:** This puts your upcoming bills at risk!' : '✅ **Viable move:** You can afford it, but try skipping 2 cafe visits next week.'}`,
        action: {
          label: "Simulate ₹850 Dinner Split",
          type: "PURCHASE",
          payload: { title: "Squad Dinner Split", amount: 850, category: "Dining", tier: "want" }
        }
      };
    }

    if (q.includes('increase') || q.includes('boost') || q.includes('more money') || q.includes('allowance')) {
      const gigBoost = Math.round(1200 / remainingDays);
      return {
        text: `**3 Smart Ways to Boost Your ₹${safeDailyAllowance}/day Limit:**\n\n1. **Pause Unused Subs:** Pausing Netflix (₹149) or Spotify (₹59) instantly frees up cash.\n2. **Quick Gig:** Earning ₹1,200 on a freelance design or tutoring gig adds **+₹${gigBoost}/day** to your daily allowance!\n3. **30% Food Diet:** Cook 3 more meals at home to recover ₹400/week.`,
        action: {
          label: "Simulate +₹1,200 Gig Inflow",
          type: "GIG",
          payload: { source: "Campus Gig / UI Design", amount: 1200 }
        }
      };
    }

    if (q.includes('risk') || q.includes('danger') || q.includes('biggest')) {
      return {
        text: `**Live Financial Risk Audit:**\n\n• **Risk Status:** ${riskLevel} (${riskLevel === 'LOW' ? 'Smooth sailing 🟢' : 'High Alert 🔴'})\n• **Upcoming Obligations:** You have **₹${totalUpcomingObligations.toLocaleString('en-IN')}** in bills locked ahead.\n• **Runway:** At current burn rate, your balance ${projectedDay30Balance < 0 ? `flips into DEFICIT (-₹${Math.abs(projectedDay30Balance)}) before Day 30!` : `safely closes month with +₹${projectedDay30Balance}.`}`,
        action: {
          label: "Open Full Decision Sandbox",
          type: "SANDBOX",
          payload: {}
        }
      };
    }

    if (q.includes('plan') || q.includes('recovery') || q.includes('1000') || q.includes('save')) {
      return {
        text: `**7-Day Alpha Budget Recovery Plan:**\n\n1. **Cap daily spending** strictly at **₹${safeDailyAllowance}** (Set UPI daily transaction limit).\n2. **Pause 1 subscription** for the next 15 days.\n3. **Deposit ₹250** into Emergency Shield vault right now to lock it away from impulse swiping.\n4. **Pick up a mini micro-gig** (+₹600) this weekend.`,
        action: {
          label: "Simulate Locking ₹250 to Shield",
          type: "VAULT",
          payload: { vaultId: "vault-1", amount: 250, direction: "DEPOSIT" }
        }
      };
    }

    // Default intelligent answer
    return {
      text: `Based on your Day ${currentDay} metrics: You have **₹${liquidBalance.toLocaleString('en-IN')} liquid cash**, **₹${totalUpcomingObligations} upcoming dues**, and a **₹${safeDailyAllowance}/day safe limit**.\n\nEvery decision you make has an interconnected impact on your Day 30 forecast (+₹${projectedDay30Balance}) and your **${healthScore}/100 Health Score**!`,
      action: {
        label: "Simulate a Spend Impact",
        type: "SANDBOX",
        payload: {}
      }
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuestion;
    if (!query.trim()) return;

    playClick();

    msgCounterRef.current += 1;
    const userMsg = {
      id: `msg-${msgCounterRef.current}`,
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAiReply(query);
      msgCounterRef.current += 1;
      const aiMsg = {
        id: `msg-ai-${msgCounterRef.current}`,
        sender: 'ai',
        text: reply.text,
        time: 'Just now',
        action: reply.action
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      playSuccessChime();
    }, 750);
  };

  // Structured Strategies list
  const strategies = [
    {
      id: "strat-diet",
      badge: "Burn Velocity",
      title: "Discretionary 25% Soft Diet",
      desc: `You're burning ₹${dailyDiscretionaryBurn}/day vs ₹${safeDailyAllowance}/day limit. Cutting Swiggy/cafe runs recovers ₹${Math.round((dailyDiscretionaryBurn - safeDailyAllowance) * remainingDays)} across the month.`,
      actionLabel: "Simulate 25% Cut",
      actionType: "DIET",
      actionPayload: { percentageCut: 25 },
    },
    {
      id: "strat-gig",
      badge: "Capital Injection",
      title: "Quick Weekend Freelance Hustle",
      desc: `Upcoming bills threaten your cash cushion. Earning ₹1,200 from a side gig instantly pushes your safe daily allowance up by +₹${Math.round(1200 / remainingDays)}/day.`,
      actionLabel: "Simulate +₹1,200 Gig",
      actionType: "GIG",
      actionPayload: { amount: 1200, source: "Campus Tutoring / UI Design" },
    },
    {
      id: "strat-vault",
      badge: "Wealth Habit",
      title: "Round-up Stash to Emergency Shield",
      desc: "Lock ₹250 into your Emergency Shield to raise your Financial Health Score resilience pillar without denting daily essentials.",
      actionLabel: "Simulate +₹250 Stash",
      actionType: "VAULT",
      actionPayload: { vaultId: "vault-1", amount: 250, direction: "DEPOSIT" },
    }
  ];

  return (
    <div className="glass-panel copilot-card futuristic-ai-container">
      {/* AI Glow Atmosphere */}
      <div className="ai-ambient-glow" />

      {/* Header with Holographic Avatar */}
      <div className="copilot-header">
        <div className="copilot-brand-wrap">
          {/* Animated Holographic AI Orb */}
          <div className="ai-orb-wrapper">
            <div className="ai-orb-ring animate-spin-slow" />
            <div className="ai-orb-core animate-pulse-glow">
              <Zap size={20} className="ai-orb-icon" />
            </div>
            <div className="ai-live-indicator" />
          </div>

          <div>
            <div className="ai-title-row">
              <h3 className="copilot-title">PULSE COPILOT</h3>
              <span className="badge badge-ai-neural">NEURAL V4.2</span>
              <span className="ai-status-pill">
                <span className="ai-pulse-dot" /> Online • Real-time Solvency
              </span>
            </div>
            <p className="copilot-subtitle">
              Gen Z Predictive Financial Intelligence & Decision Strategist
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="ai-view-tabs">
          <button 
            className={`ai-tab-btn ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveView('chat'); }}
          >
            <MessageSquare size={14} />
            <span>AI Consult Chat</span>
          </button>

          <button 
            className={`ai-tab-btn ${activeView === 'strategies' ? 'active' : ''}`}
            onClick={() => { playClick(); setActiveView('strategies'); }}
          >
            <Compass size={14} />
            <span>Alpha Strategies</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE AI CHAT */}
      {activeView === 'chat' && (
        <div className="ai-chat-interface animate-slide-up">
          {/* Messages Stream */}
          <div className="ai-messages-scroll">
            {messages.map((m) => (
              <div key={m.id} className={`ai-message-bubble-wrap ${m.sender === 'user' ? 'msg-user' : 'msg-ai'}`}>
                {m.sender === 'ai' && (
                  <div className="ai-bubble-avatar">
                    <Bot size={16} />
                  </div>
                )}
                <div className="ai-bubble-content">
                  <div className="ai-bubble-text">
                    {m.text.split('\n\n').map((para, idx) => (
                      <p key={idx} dangerouslySetInnerHTML={{ 
                        __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    ))}
                  </div>

                  {m.action && (
                    <div className="ai-bubble-action-box">
                      <button 
                        className="btn-ai-action"
                        onClick={() => {
                          playClick();
                          if (m.action.type === 'SANDBOX') {
                            onOpenSimulator();
                          } else {
                            onQuickSimulate(m.action.type, m.action.payload);
                          }
                        }}
                      >
                        <Sparkles size={13} />
                        <span>{m.action.label}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}

                  <span className="ai-bubble-time">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="typing-text">PULSE AI analyzing cashflow impact...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="ai-quick-prompts-row">
            <span className="prompts-label">Tap to Ask:</span>
            <div className="prompts-chips-list">
              {suggestedQuestions.map((sq, i) => (
                <button 
                  key={i} 
                  className="ai-chip-pill"
                  onClick={() => handleSendMessage(sq.query)}
                >
                  <Sparkles size={11} className="text-violet" />
                  <span>{sq.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form 
            className="ai-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input 
              type="text"
              placeholder="Ask PULSE AI anything (e.g. Can I afford a ₹1,200 concert pass?)"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="ai-input-field"
            />
            <button 
              type="submit" 
              className="btn-ai-send"
              disabled={!inputQuestion.trim()}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* VIEW 2: STRATEGIES LIST */}
      {activeView === 'strategies' && (
        <div className="ai-strategies-interface animate-slide-up">
          <div className="copilot-insight-box">
            <div className="insight-lead">
              <Lightbulb size={17} className="text-amber" />
              <span className="insight-lead-text">
                {riskLevel === 'CRITICAL' && "🚨 Critical Insolvency: Immediate intervention required to protect rent and bills."}
                {riskLevel === 'HIGH' && "⚠️ Caution: Current daily burn rate will deplete your remaining balance before Day 30."}
                {riskLevel === 'MODERATE' && "⚡ Good trajectory! Staying below ₹" + safeDailyAllowance + "/day guarantees full month-end comfort."}
                {riskLevel === 'LOW' && "🔥 Top tier discipline! You have enough cushion to treat yourself or stash extra."}
              </span>
            </div>
          </div>

          <div className="copilot-strategies-grid">
            {strategies.map((strat) => (
              <div key={strat.id} className="copilot-strat-card">
                <div className="strat-card-header">
                  <span className="badge badge-violet">{strat.badge}</span>
                  <h5 className="strat-title">{strat.title}</h5>
                </div>
                <p className="strat-desc">{strat.desc}</p>
                <button 
                  className="btn-strat-action"
                  onClick={() => onQuickSimulate(strat.actionType, strat.actionPayload)}
                >
                  <span>{strat.actionLabel}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
