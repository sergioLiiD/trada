import React from 'react';
import Card from './shared/Card';
import { DashboardMetrics } from '../types';

interface PerformanceDashboardProps {
  metrics: DashboardMetrics;
  onOpenAnalytics: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ metrics, onOpenAnalytics }) => {
  const formatMetric = (value: number | null, suffix = '', decimals = 2) => {
    if (value == null || !isFinite(value)) {
      return value > 0 ? `∞${suffix}` : 'N/A';
    }
    return `${value.toFixed(decimals)}${suffix}`;
  };

  const formatRatio = (value: number | null) => {
    if (value == null || !isFinite(value)) {
      return '—';
    }
    return `${value.toFixed(2)} : 1`;
  };

  const pnlColor = metrics.totalPnl >= 0 ? 'text-green-500' : 'text-red-500';

  const metricItems = [
    {
      label: 'Capital Actual',
      value: `$${formatMetric(metrics.currentCapital, '', 2)}`,
    },
    {
      label: 'P/L Total ($)',
      value: `$${formatMetric(metrics.totalPnl, '', 2)}`,
      highlightClass: pnlColor,
    },
    {
      label: 'Win Rate',
      value: formatMetric(metrics.winRate, '%'),
    },
    {
      label: 'Profit Factor',
      value: formatMetric(metrics.profitFactor),
    },
    {
      label: 'ROI Promedio',
      value: metrics.averageRoi != null ? `${formatMetric(metrics.averageRoi, '%')}` : '—',
    },
    {
      label: 'R:R Realizado Promedio',
      value: formatRatio(metrics.averageRrRealized),
    },
    {
      label: 'Riesgo Cuenta Promedio',
      value: metrics.averageAccountRiskPercent != null ? `${formatMetric(metrics.averageAccountRiskPercent, '%')}` : '—',
    },
  ];

  return (
    <Card title="Performance Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 text-center">
        {metricItems.map(item => (
          <div key={item.label}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className={`text-2xl font-bold ${item.highlightClass ?? ''}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onOpenAnalytics}
          className="bg-primary hover:brightness-95 text-gray-900 font-bold py-2 px-6 rounded-md transition duration-300"
        >
          Performance Analytics
        </button>
      </div>
    </Card>
  );
};

export default PerformanceDashboard;
