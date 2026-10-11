/**
 * Export Service for Financial Telemetry (JSON & CSV)
 */
export const exportService = {
  exportToJSON: (data, filename = 'pulse30-financial-telemetry.json') => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  },

  exportToCSV: (transactions, filename = 'pulse30-transactions.csv') => {
    try {
      const headers = ['ID', 'Title', 'Amount', 'Category', 'Tier', 'Day', 'Type', 'Notes'];
      const rows = transactions.map((t) => [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        t.category,
        t.tier,
        t.day,
        t.type,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  }
};
