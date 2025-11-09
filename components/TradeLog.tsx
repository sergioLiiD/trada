import React, { useMemo } from 'react';
import Card from './shared/Card';
import { TradeWithPnl } from '../types';

interface TradeLogProps {
  trades: TradeWithPnl[];
  onDeleteTrade: (tradeId: string) => void;
  onEditTrade: (tradeId: string) => void;
}

const DECIMAL_PRECISION = 6;

const formatNumber = (value: number) => {
  const factor = Math.pow(10, DECIMAL_PRECISION);
  const truncated = Math.trunc(value * factor) / factor;
  return truncated.toFixed(DECIMAL_PRECISION);
};

const TradeLog: React.FC<TradeLogProps> = ({ trades, onDeleteTrade, onEditTrade }) => {
    
  const totals = useMemo(() => {
    return trades.reduce((acc, trade) => {
      acc.pnlNet += trade.pnlNet;
      acc.fees += trade.fees;
      acc.riskAmount += trade.riskAmount;
      acc.margin += trade.margin;
      return acc;
    }, { pnlNet: 0, fees: 0, riskAmount: 0, margin: 0 });
  }, [trades]);

  const pnlColor = (pnl: number) => pnl >= 0 ? 'text-green-500' : 'text-red-500';
  const handleDelete = (tradeId: string) => {
    if (window.confirm('Delete this trade? This action cannot be undone.')) {
      onDeleteTrade(tradeId);
    }
  };
  const handleEdit = (tradeId: string) => {
    onEditTrade(tradeId);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Trade Log</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="py-3 px-2">Date</th>
              <th scope="col" className="py-3 px-2">Pair</th>
              <th scope="col" className="py-3 px-2">Direction</th>
              <th scope="col" className="py-3 px-2">Entry</th>
              <th scope="col" className="py-3 px-2">Exit</th>
              <th scope="col" className="py-3 px-2">Closed</th>
              <th scope="col" className="py-3 px-2">Pos. Size</th>
              <th scope="col" className="py-3 px-2">Leverage</th>
              <th scope="col" className="py-3 px-2">Margin ($)</th>
              <th scope="col" className="py-3 px-2">R/R</th>
              <th scope="col" className="py-3 px-2">Risk ($)</th>
              <th scope="col" className="py-3 px-2">Fees ($)</th>
              <th scope="col" className="py-3 px-2">P/L ($)</th>
              <th scope="col" className="py-3 px-2">P/L Asset %</th>
              <th scope="col" className="py-3 px-2">P/L Margin %</th>
              <th scope="col" className="py-3 px-2">Capital End</th>
              <th scope="col" className="py-3 px-2">Strategy</th>
              <th scope="col" className="py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="py-2 px-2">{new Date(trade.dateTime).toLocaleString()}</td>
                <td className="py-2 px-2 font-medium">{trade.pair}</td>
                <td className={`py-2 px-2 font-semibold ${trade.direction === 'Long' ? 'text-green-500' : 'text-red-500'}`}>{trade.direction}</td>
                <td className="py-2 px-2">{formatNumber(trade.entryPrice)}</td>
                <td className="py-2 px-2">{formatNumber(trade.exitPrice)}</td>
                <td className="py-2 px-2">{trade.closeDateTime ? new Date(trade.closeDateTime).toLocaleString() : '—'}</td>
                <td className="py-2 px-2">{formatNumber(trade.positionSize)}</td>
                <td className="py-2 px-2">{trade.leverage}x</td>
                <td className="py-2 px-2">{formatNumber(trade.margin)}</td>
                <td className="py-2 px-2">{trade.riskReward}</td>
                <td className="py-2 px-2">{formatNumber(trade.riskAmount)}</td>
                <td className="py-2 px-2">{formatNumber(trade.fees)}</td>
                <td className={`py-2 px-2 font-bold ${pnlColor(trade.pnlNet)}`}>{formatNumber(trade.pnlNet)}</td>
                <td className={`py-2 px-2 ${pnlColor(trade.pnlAssetPercent)}`}>{formatNumber(trade.pnlAssetPercent)}%</td>
                <td className={`py-2 px-2 ${pnlColor(trade.pnlMarginPercent)}`}>{formatNumber(trade.pnlMarginPercent)}%</td>
                <td className="py-2 px-2">{formatNumber(trade.capitalEnd)}</td>
                <td className="py-2 px-2">{trade.strategy}</td>
                <td className="py-2 px-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(trade.id)}
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
             {trades.length === 0 && (
                <tr>
                    <td colSpan={18} className="text-center py-4">No trades logged yet.</td>
                </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700">
                <td colSpan={8} className="py-2 px-2 text-right">Totals:</td>
                <td className="py-2 px-2">{formatNumber(totals.margin)}</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2">{formatNumber(totals.riskAmount)}</td>
                <td className="py-2 px-2">{formatNumber(totals.fees)}</td>
                <td className={`py-2 px-2 ${pnlColor(totals.pnlNet)}`}>{formatNumber(totals.pnlNet)}</td>
                <td colSpan={4} className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

export default TradeLog;
