# Architecture Guide — PULSE 30

## Overview
PULSE 30 is built following clean domain-driven architecture for frontend web applications.

```
src/
├── components/          # Presentational & interactive UI widgets
├── constants/           # Core budget rules and theme design tokens
├── context/             # React Context for global state distribution
├── data/                # Initial baseline data and persona scenarios
├── hooks/               # Custom lifecycle and state management hooks
├── services/            # Domain logic, persistence, and file export services
├── types/               # Type declarations for domain entities
└── utils/               # Pure mathematical engine calculations & audio synth
```

## Resilience Pillars
1. **Liquid Burn Protection**: Walling off unpaid bills from daily discretionary allowances.
2. **Deterministic Cascading**: Pure function calculations allowing instant preview of future financial states.
3. **Graceful Fault Tolerance**: React Error Boundary catches runtime state exceptions without full browser crash.
