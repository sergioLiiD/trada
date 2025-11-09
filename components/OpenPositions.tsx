import React from 'react';
import Card from './shared/Card';
import { Trade } from '../types';

interface OpenPositionsProps {
  trades: Trade[];
  onEditTrade: (tradeId: string) => void;
  onDeleteTrade: (tradeId: string) => void;
}

const OpenPositions: React.FC<OpenPositionsProps> = ({ trades, onEditTrade, onDeleteTrade }) => {
  const handleDelete = (tradeId: string) => {
    if (window.confirm('Delete this open position? This action cannot be undone.')) {
      onDeleteTrade(tradeId);
    }
  };

  if (trades.length === 0) {
    return (
      <Card title="Open Positions">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No open positions at the moment.</p>
      </Card>
    );
  }

  return (
    <Card title="Open Positions">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="py-3 px-2">Opened</th>
              <th scope="col" className="py-3 px-2">Pair</th>
              <th scope="col" className="py-3 px-2">Direction</th>
              <th scope="col" className="py-3 px-2">Entry</th>
              <th scope="col" className="py-3 px-2">Margin ($)</th>
              <th scope="col" className="py-3 px-2">Leverage</th>
              <th scope="col" className="py-3 px-2">Risk (%)</th>
              <th scope="col" className="py-3 px-2">Notes</th>
              <th scope="col" className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="py-2 px-2">{new Date(trade.dateTime).toLocaleString()}</td>
                <td className="py-2 px-2 font-medium">{trade.pair}</td>
                <td className={`py-2 px-2 font-semibold ${trade.direction === 'Long' ? 'text-green-500' : 'text-red-500'}`}>{trade.direction}</td>
                <td className="py-2 px-2">{trade.entryPrice.toFixed(2)}</td>
                <td className="py-2 px-2">{trade.margin.toFixed(2)}</td>
                <td className="py-2 px-2">{trade.leverage}x</td>
                <td className="py-2 px-2">{trade.riskPercent.toFixed(2)}%</td>
                <td className="py-2 px-2">{trade.notes || '—'}</td>
                <td className="py-2 px-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => onEditTrade(trade.id)}
                    className="text-primary hover:brightness-90 font-semibold text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="text-red-600 hover:text-red-500 font-semibold text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OpenPositions;

