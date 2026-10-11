# ⚡ PULSE 30 — Gen Z Financial Command & Decision Simulator

A modern, interactive personal finance web application built for Gen Z to master a **₹10,000 monthly budget over 30 days**.

Beyond basic expense tracking, **PULSE 30** interconnects:
- **Liquid Cash Balance** (after vault savings)
- **Safe-To-Spend Daily Burn Allowance** (`(Balance - Upcoming Dues) / Remaining Days`)
- **Upcoming Fixed Commitments** (PG Rent share, 5G Recharge, Wi-Fi bill, Laptop EMI)
- **Subscription Management** (Spotify Student, Netflix, Blinkit pass) with instant daily allowance recovery
- **Goal-Based Savings Vaults** (*Emergency Shield*, *Concert Pass*, *Sneaker Drop*)
- **"Life Happens" Unexpected Expense Deck** (Transit surges, birthday splits, health checkups)
- **Financial Health Score (0 - 100)** across 4 core resilience pillars
- **Interactive 30-Day Solvency & Trajectory Curves**
- **Decision Sandbox & What-If Simulator** with live full-dashboard cascading preview

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS Design Tokens (Dark Obsidian `#070A12`, Glassmorphism, Neon Accents)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Audio**: Web Audio API Sound Synthesizer (Zero external dependencies)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 🧠 Key Mechanics

### Safe Daily Burn Allowance
$$\text{Safe Daily Allowance} = \frac{\text{Liquid Balance} - \text{Total Upcoming Fixed Commitments}}{\text{Remaining Days}}$$

### What-If Decision Simulation
Test-drive financial moves before swiping:
- **Impulse Spends**: Evaluate impact of ₹1,800 Zara hoodie or ₹850 dinner splits.
- **Subscription Cuts**: Pause Netflix or Spotify to free up daily burn velocity.
- **Freelance Gigs**: Offset expenses with tutoring or design assignments.
- **Spending Diets**: Simulate reducing non-essential food spends by 10%–70%.
