import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { TradeWithPnl, Capital } from '../types';

Chart.register(...registerables);

interface PerformanceAnalyticsModalProps {
  onClose: () => void;
  trades: TradeWithPnl[];
  capital: Capital;
}

const PerformanceAnalyticsModal: React.FC<PerformanceAnalyticsModalProps> = ({ onClose, trades, capital }) => {
  const equityCurveRef = useRef<HTMLCanvasElement>(null);
  const pnlDistributionRef = useRef<HTMLCanvasElement>(null);
  const strategyPnlRef = useRef<HTMLCanvasElement>(null);
  const rrComparisonRef = useRef<HTMLCanvasElement>(null);
  const roiDistributionRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const charts: Chart[] = [];

    // 1. Equity Curve
    if (equityCurveRef.current) {
      const ctx = equityCurveRef.current.getContext('2d');
      if (ctx) {
        const equityChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Initial', ...trades.map((_, i) => `Trade ${i + 1}`)],
            datasets: [{
              label: 'Equity Curve',
              data: [capital.initial + capital.deposits, ...trades.map(t => t.capitalEnd)],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            }],
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Equity Curve' }
            },
            scales: {
                y: { beginAtZero: false, ticks: { callback: (value) => `$${value}` } },
            },
          }
        });
        charts.push(equityChart);
      }
    }

    // 2. P/L Distribution
    if (pnlDistributionRef.current) {
      const ctx = pnlDistributionRef.current.getContext('2d');
      if (ctx) {
        const pnlChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: trades.map((_, i) => `Trade ${i + 1}`),
            datasets: [{
              label: 'P/L per Trade ($)',
              data: trades.map(t => t.pnlNet),
              backgroundColor: trades.map(t => t.pnlNet >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
              borderColor: trades.map(t => t.pnlNet >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'P/L Distribution' }
            },
            scales: {
                y: { ticks: { callback: (value) => `$${value}` } },
            },
          }
        });
        charts.push(pnlChart);
      }
    }
    
    // 3. Net Profit by Strategy
    if (strategyPnlRef.current) {
        const strategyPnl: {[key: string]: number} = trades.reduce((acc, trade) => {
            const strategy = trade.strategy || 'Uncategorized';
            if (!acc[strategy]) {
                acc[strategy] = 0;
            }
            acc[strategy] += trade.pnlNet;
            return acc;
        }, {} as {[key: string]: number});

        const labels = Object.keys(strategyPnl);
        const data = Object.values(strategyPnl);

        const ctx = strategyPnlRef.current.getContext('2d');
        if (ctx) {
            const strategyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Net P/L by Strategy ($)',
                        data: data,
                        backgroundColor: data.map(pnl => pnl >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
                        borderColor: data.map(pnl => pnl >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // Horizontal bar chart
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'Net Profit by Strategy' }
                    },
                    scales: {
                        x: { ticks: { callback: (value) => `$${value}` } },
                    }
                }
            });
            charts.push(strategyChart);
        }
    }

    // 4. Realized vs Planned R:R
    if (rrComparisonRef.current) {
        const ctx = rrComparisonRef.current.getContext('2d');
        if (ctx) {
            const rrChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: trades.map((_, i) => `Trade ${i + 1}`),
                    datasets: [
                        {
                            label: 'R:R Realizado',
                            data: trades.map(t => t.rrRealized ?? null),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'R:R Planeado',
                            data: trades.map(t => t.rrPlanned ?? null),
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'R:R Realizado vs Planeado' },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => `${value}:1`,
                            },
                        },
                    },
                },
            });
            charts.push(rrChart);
        }
    }

    // 5. ROI Distribution
    if (roiDistributionRef.current) {
        const ctx = roiDistributionRef.current.getContext('2d');
        if (ctx) {
            const roiChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: trades.map((_, i) => `Trade ${i + 1}`),
                    datasets: [{
                        label: 'ROI (%)',
                        data: trades.map(t => t.roiPercent ?? null),
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        tension: 0.2,
                        fill: false,
                        spanGaps: true,
                    }],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: 'ROI por Trade' },
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => `${value}%`,
                            },
                        },
                    },
                },
            });
            charts.push(roiChart);
        }
    }

    return () => {
      charts.forEach(chart => chart.destroy());
    };
  }, [trades, capital]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">Performance Analytics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </header>
        <main className="p-6 overflow-y-auto">
          {trades.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500">Log some trades to see your performance analytics.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="xl:col-span-2">
                <canvas ref={equityCurveRef}></canvas>
              </div>
              <div>
                <canvas ref={pnlDistributionRef}></canvas>
              </div>
              <div>
                <canvas ref={strategyPnlRef}></canvas>
              </div>
              <div>
                <canvas ref={rrComparisonRef}></canvas>
              </div>
              <div>
                <canvas ref={roiDistributionRef}></canvas>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsModal;
