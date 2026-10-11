import React, { useState } from 'react';
import { Info, AlertTriangle } from 'lucide-react';

export function TrajectoryChart({ 
  trajectoryPoints = [], 
  currentDay = 9, 
  totalDays = 30,
  simulatedTrajectoryPoints = null,
  isSimulating = false
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const padding = { top: 25, right: 35, bottom: 35, left: 55 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Determine min and max Y across all points (with safety margin for negative deficits)
  let minY = 0;
  let maxY = 10000;

  trajectoryPoints.forEach((p) => {
    if (p.actual !== null && p.actual < minY) minY = p.actual;
    if (p.projected !== null && p.projected < minY) minY = p.projected;
    if (p.actual !== null && p.actual > maxY) maxY = p.actual;
    if (p.projected !== null && p.projected > maxY) maxY = p.projected;
  });

  if (simulatedTrajectoryPoints) {
    simulatedTrajectoryPoints.forEach((p) => {
      if (p.projected !== null && p.projected < minY) minY = p.projected;
      if (p.projected !== null && p.projected > maxY) maxY = p.projected;
    });
  }

  // Add margin to Y
  minY = Math.min(-1000, Math.floor(minY / 500) * 500);
  maxY = Math.max(10500, Math.ceil(maxY / 1000) * 1000);

  const getX = (day) => {
    return padding.left + ((day - 1) / (totalDays - 1)) * plotWidth;
  };

  const getY = (val) => {
    const clampedVal = Math.max(minY, Math.min(maxY, val));
    const ratio = (clampedVal - minY) / (maxY - minY);
    return padding.top + (1 - ratio) * plotHeight;
  };

  const zeroY = getY(0);

  // Generate SVG path strings
  // 1. Historical Actuals path (Day 1 to currentDay)
  const historicalPoints = trajectoryPoints.filter((p) => p.day <= currentDay);
  const actualPath = historicalPoints.length > 0
    ? historicalPoints.reduce((acc, p, idx) => {
        const x = getX(p.day);
        const y = getY(p.actual ?? p.projected);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, "")
    : "";

  // 2. Projected Future path (currentDay to Day 30)
  const projectedPoints = trajectoryPoints.filter((p) => p.day >= currentDay);
  const projectedPath = projectedPoints.length > 0
    ? projectedPoints.reduce((acc, p, idx) => {
        const x = getX(p.day);
        const y = getY(p.projected);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, "")
    : "";

  // 3. Simulated Trajectory path (if simulating)
  const simPoints = simulatedTrajectoryPoints
    ? simulatedTrajectoryPoints.filter((p) => p.day >= currentDay)
    : [];
  const simPath = simPoints.length > 0
    ? simPoints.reduce((acc, p, idx) => {
        const x = getX(p.day);
        const y = getY(p.projected);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, "")
    : "";

  // Area under curve for actuals
  const actualArea = historicalPoints.length > 0
    ? `${actualPath} L ${getX(currentDay)} ${zeroY} L ${getX(1)} ${zeroY} Z`
    : "";

  const finalProjectedPoint = trajectoryPoints[trajectoryPoints.length - 1];
  const finalSimPoint = simPoints.length > 0 ? simPoints[simPoints.length - 1] : null;

  return (
    <div className="glass-panel trajectory-card">
      <div className="trajectory-header">
        <div>
          <h3 className="trajectory-title">30-Day Solvency & Balance Trajectory</h3>
          <p className="trajectory-subtitle">
            Historical bank trajectory vs forecasted runway to Day 30
          </p>
        </div>

        <div className="trajectory-legend">
          <div className="legend-item">
            <span className="legend-line line-actual" />
            <span>Actual Logged (D1-D{currentDay})</span>
          </div>
          <div className="legend-item">
            <span className="legend-line line-projected" />
            <span>Forecast at Burn Rate</span>
          </div>
          {isSimulating && (
            <div className="legend-item">
              <span className="legend-line line-simulated" />
              <span>Simulated Consequence</span>
            </div>
          )}
        </div>
      </div>

      <div className="trajectory-chart-wrap">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="trajectory-svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Linear gradient for area */}
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>

            {/* Gradient for simulation line */}
            <linearGradient id="simGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>

          {/* Deficit Danger Zone (below 0) */}
          {minY < 0 && (
            <rect
              x={padding.left}
              y={zeroY}
              width={plotWidth}
              height={padding.top + plotHeight - zeroY}
              fill="rgba(244, 63, 94, 0.08)"
            />
          )}

          {/* Grid lines (horizontal) */}
          {[10000, 7500, 5000, 2500, 0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke={val === 0 ? "rgba(244, 63, 94, 0.45)" : "rgba(255, 255, 255, 0.06)"}
                  strokeDasharray={val === 0 ? "4 4" : "2 2"}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill={val === 0 ? "var(--accent-rose)" : "var(--text-muted)"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  textAnchor="end"
                >
                  ₹{val >= 1000 ? `${val / 1000}k` : val}
                </text>
              </g>
            );
          })}

          {/* Day markers on X axis */}
          {[1, 5, 10, 15, 20, 25, 30].map((d) => {
            const x = getX(d);
            return (
              <text
                key={d}
                x={x}
                y={svgHeight - 12}
                fill={d === currentDay ? "var(--accent-cyan)" : "var(--text-muted)"}
                fontWeight={d === currentDay ? "700" : "500"}
                fontSize="11"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
              >
                D{d}
              </text>
            );
          })}

          {/* Current Day Vertical Divider */}
          <line
            x1={getX(currentDay)}
            y1={padding.top}
            x2={getX(currentDay)}
            y2={svgHeight - padding.bottom}
            stroke="var(--accent-cyan)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Area under historical curve */}
          {actualArea && (
            <path d={actualArea} fill="url(#actualGradient)" />
          )}

          {/* Forecasted Trajectory Path */}
          {projectedPath && (
            <path
              d={projectedPath}
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />
          )}

          {/* Simulated Decision Trajectory Path */}
          {isSimulating && simPath && (
            <path
              d={simPath}
              fill="none"
              stroke="url(#simGradient)"
              strokeWidth="3.5"
              strokeDasharray="6 3"
              className="animate-pulse-glow"
            />
          )}

          {/* Actual Logged Path */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Dots on Key Events */}
          {trajectoryPoints.map((p) => {
            if (!p.hasCommitment) return null;
            const x = getX(p.day);
            const val = p.isHistorical ? p.actual : p.projected;
            const y = getY(val);
            return (
              <circle
                key={`comm-${p.day}`}
                cx={x}
                cy={y}
                r="4.5"
                fill="var(--accent-amber)"
                stroke="#0B0F17"
                strokeWidth="2"
              />
            );
          })}

          {/* Current Day Head Dot */}
          {currentDay && (
            <circle
              cx={getX(currentDay)}
              cy={getY(historicalPoints[historicalPoints.length - 1]?.actual ?? 4280)}
              r="6"
              fill="var(--accent-cyan)"
              stroke="white"
              strokeWidth="2.5"
            />
          )}

          {/* Interactive invisible touch points */}
          {trajectoryPoints.map((p) => {
            const x = getX(p.day);
            const y = getY(p.isHistorical ? (p.actual ?? p.projected) : p.projected);
            return (
              <circle
                key={`hit-${p.day}`}
                cx={x}
                cy={y}
                r="10"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div 
            className="chart-hover-tooltip"
            style={{ 
              left: `${(hoveredPoint.day / 30) * 85 + 5}%`,
              top: '20px'
            }}
          >
            <div className="tooltip-day">Day {hoveredPoint.day}</div>
            <div className="tooltip-val mono">
              ₹{(hoveredPoint.actual ?? hoveredPoint.projected).toLocaleString('en-IN')}
            </div>
            <div className="tooltip-status">
              {hoveredPoint.isHistorical ? "Actual Logged" : "Forecasted"}
              {hoveredPoint.hasCommitment && " • Bill Due"}
            </div>
          </div>
        )}
      </div>

      <div className="trajectory-footer">
        <div className="trajectory-summary-pill">
          <Info size={13} className="text-cyan" />
          <span>
            Target End-of-Month:{" "}
            <strong className={finalProjectedPoint?.projected < 0 ? "text-rose" : "text-mint"}>
              ₹{finalProjectedPoint?.projected?.toLocaleString('en-IN') ?? 0}
            </strong>
          </span>
        </div>
        {isSimulating && finalSimPoint && (
          <div className="trajectory-summary-pill sim-pill">
            <AlertTriangle size={13} className="text-amber" />
            <span>
              Simulated End-of-Month:{" "}
              <strong className={finalSimPoint.projected < 0 ? "text-rose" : "text-mint"}>
                ₹{finalSimPoint.projected.toLocaleString('en-IN')}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
