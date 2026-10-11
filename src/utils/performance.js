/**
 * Performance Monitoring & Web Vitals Telemetry for PULSE 30
 */

export function markPerformanceEvent(name) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

export function measurePerformance(name, startMark, endMark) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
    } catch {
      // Ignore if marks not found
    }
  }
}

export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            onPerfEntry(entry);
          }
        });
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      } catch {
        // Fallback gracefully
      }
    }
  }
}
