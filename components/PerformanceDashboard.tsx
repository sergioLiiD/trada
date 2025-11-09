import React from 'react';
import Card from './shared/Card';
import { DashboardMetrics } from '../types';

interface PerformanceDashboardProps {
  metrics: DashboardMetrics;
  onOpenAnalytics: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ metrics, onOpenAnalytics }) => {
  const formatMetric = (value: number, suffix = '', decimals = 2) => {
    if (!isFinite(value)) return 'N/A';
    return `${value.toFixed(decimals)}${suffix}`;
  };

  const pnlColor = metrics.totalPnl >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card title="Performance Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Capital</p>
          <p className="text-2xl font-bold">${formatMetric(metrics.currentCapital)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total P/L ($)</p>
          <p className={`text-2xl font-bold ${pnlColor}`}>${formatMetric(metrics.totalPnl)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
          <p className="text-2xl font-bold">{formatMetric(metrics.winRate, '%')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Profit Factor</p>
          <p className="text-2xl font-bold">{formatMetric(metrics.profitFactor)}</p>
        </div>
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
