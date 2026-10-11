import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PULSE 30 Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback" role="alert" aria-live="assertive">
          <div className="glass-panel error-fallback-card">
            <div className="error-icon-wrap" aria-hidden="true">
              <AlertTriangle size={36} className="text-rose" />
            </div>
            <h2>Something went wrong in PULSE 30</h2>
            <p className="text-secondary">
              The financial simulation engine encountered an unexpected state. Your budget data is safe in local storage.
            </p>
            <pre className="error-stack-trace">
              {this.state.error?.message || 'Unknown runtime error'}
            </pre>
            <button className="btn-primary" onClick={this.handleReset}>
              <RotateCcw size={16} />
              <span>Reload Simulation Engine</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
