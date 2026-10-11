import React, { useState } from 'react';
import { 
  Zap, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Sliders,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PERSONA_PRESETS } from '../data/initialData';
import { toggleSound, isSoundEnabled, playClick } from '../utils/audioEffects';

export function Navbar({ 
  currentDay, 
  onSelectPreset, 
  onResetData, 
  onOpenSimulator, 
  onOpenAddExpense,
  isSimulating = false
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  const handlePresetClick = (presetId) => {
    playClick();
    onSelectPreset(presetId);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-badge-icon">
            <Zap size={22} className="brand-lightning" />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">PULSE</span>
              <span className="brand-tag">30</span>
              <span className="badge badge-violet brand-subtext">₹10K / 30D</span>
              {isSimulating && (
                <span className="badge badge-amber animate-pulse-glow">SIMULATION ACTIVE</span>
              )}
            </div>
            <p className="brand-tagline">Gen Z Financial Command & Decision Simulator</p>
          </div>
        </div>

        {/* Persona Preset Switcher */}
        <div className="persona-nav-group">
          <span className="persona-label">
            <Sliders size={14} />
            <span>Scenarios:</span>
          </span>
          <div className="persona-pills">
            {PERSONA_PRESETS.map((preset) => {
              const isSelected = preset.day === currentDay;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.id)}
                  className={`persona-pill ${isSelected ? 'active' : ''}`}
                  title={preset.description}
                >
                  <span className="persona-pill-title">{preset.name}</span>
                  <span className="persona-pill-day">Day {preset.day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="navbar-actions">
          <button 
            className={`btn-simulator-glow ${isSimulating ? 'sim-btn-active' : ''}`}
            onClick={() => {
              playClick();
              onOpenSimulator();
            }}
            title="Simulate a financial decision before swiping"
          >
            <Sparkles size={16} />
            <span>{isSimulating ? "Tweak Simulation" : "Test-Drive Decision"}</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={() => {
              playClick();
              onOpenAddExpense();
            }}
            title="Log new transaction"
          >
            <span>+ Log Spend</span>
          </button>

          <button 
            className="btn-icon" 
            onClick={handleSoundToggle}
            title={soundOn ? "Mute Sound Effects" : "Enable Sound Effects"}
          >
            {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button 
            className="btn-icon" 
            onClick={() => {
              playClick();
              onResetData();
            }}
            title="Reset to default ₹10K state"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
