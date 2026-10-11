import React from 'react';
import { Calendar, ChevronRight, Rewind } from 'lucide-react';

export function TimelineScrubber({ 
  currentDay, 
  totalDays = 30, 
  onDayChange
}) {
  const remainingDays = Math.max(1, totalDays - currentDay + 1);
  const progressPercent = Math.round((currentDay / totalDays) * 100);

  // Key milestones across the month
  const milestones = [
    { day: 1, label: "Stipend", type: "income" },
    { day: 5, label: "Rent Share", type: "commitment", isPaid: true },
    { day: 14, label: "Mobile Bill", type: "commitment", isPaid: false },
    { day: 18, label: "Wi-Fi Due", type: "commitment", isPaid: false },
    { day: 24, label: "Laptop EMI", type: "commitment", isPaid: false },
    { day: 30, label: "Month Close", type: "finish" },
  ];

  return (
    <div className="glass-panel timeline-scrubber-card">
      <div className="timeline-header">
        <div className="timeline-title-wrap">
          <div className="timeline-calendar-icon">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="timeline-heading">
              30-Day Budget Timeline: <span className="timeline-day-highlight">Day {currentDay} of {totalDays}</span>
            </h3>
            <p className="timeline-subheading">
              {remainingDays} days remaining in cycle • Month {progressPercent}% elapsed
            </p>
          </div>
        </div>

        {/* Quick jump controls */}
        <div className="timeline-controls">
          <button 
            className="timeline-nav-btn"
            onClick={() => onDayChange(Math.max(1, currentDay - 1))}
            disabled={currentDay <= 1}
            title="Previous Day"
          >
            <Rewind size={14} />
            <span>-1 Day</span>
          </button>

          <button 
            className="timeline-nav-btn highlight"
            onClick={() => onDayChange(Math.min(totalDays, currentDay + 1))}
            disabled={currentDay >= totalDays}
            title="Next Day"
          >
            <span>+1 Day</span>
            <ChevronRight size={14} />
          </button>

          <button 
            className="timeline-jump-pill"
            onClick={() => onDayChange(1)}
          >
            Day 1
          </button>
          <button 
            className="timeline-jump-pill"
            onClick={() => onDayChange(15)}
          >
            Mid-Month (Day 15)
          </button>
          <button 
            className="timeline-jump-pill"
            onClick={() => onDayChange(30)}
          >
            Month End (Day 30)
          </button>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="timeline-track-container">
        <input
          type="range"
          min="1"
          max={totalDays}
          value={currentDay}
          onChange={(e) => onDayChange(Number(e.target.value))}
          className="timeline-slider"
          aria-label="30-day budget scrubber"
        />

        {/* Milestone Pin Indicators */}
        <div className="timeline-milestones">
          {milestones.map((m) => {
            const posPercent = ((m.day - 1) / (totalDays - 1)) * 100;
            const isPassed = currentDay >= m.day;
            const isCurrent = currentDay === m.day;

            return (
              <div 
                key={m.day} 
                className={`milestone-marker ${isPassed ? 'passed' : ''} ${isCurrent ? 'active' : ''}`}
                style={{ left: `${posPercent}%` }}
                onClick={() => onDayChange(m.day)}
                title={`Jump to Day ${m.day}: ${m.label}`}
              >
                <div className={`milestone-dot dot-${m.type}`} />
                <span className="milestone-text">
                  D{m.day}: {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
