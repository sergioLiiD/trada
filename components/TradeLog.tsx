import React, { useMemo } from 'react';
import Card from './shared/Card';
import { TradeWithPnl } from '../types';

interface TradeLogProps {
  trades: TradeWithPnl[];
  onDeleteTrade: (tradeId: string) => void;
  onEditTrade: (tradeId: string) => void;
}

interface HeaderCellProps {
  label: string;
  tooltip?: string;
  className?: string;
}

const HeaderCell: React.FC<HeaderCellProps> = ({ label, tooltip, className }) => (
  <th scope="col" className={`py-3 px-2 ${className ?? ''}`}>
    <span className="relative inline-flex items-center space-x-1 group">
      <span>{label}</span>
      {tooltip && (
        <>
          <button
            type="button"
            className="text-xs leading-none text-primary border border-primary/40 rounded-full w-4 h-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/60"
            aria-label={`Ver explicación de ${label}`}
            tabIndex={0}
          >
            i
          </button>
          <span
            role="tooltip"
            className="absolute z-20 hidden group-hover:flex group-focus-within:flex flex-col max-w-xs text-left text-xs text-white bg-gray-900/95 px-3 py-2 rounded-md shadow-lg top-full mt-2 left-1/2 -translate-x-1/2"
          >
            {tooltip}
          </span>
        </>
      )}
    </span>
  </th>
);

const DECIMAL_PRECISION = 6;

const formatNumber = (value: number) => {
  const factor = Math.pow(10, DECIMAL_PRECISION);
  const truncated = Math.trunc(value * factor) / factor;
  return truncated.toFixed(DECIMAL_PRECISION);
};

const formatNullable = (value: number | null | undefined, decimals = 2) => {
  if (value == null || !isFinite(value)) {
    return '—';
  }
  const factor = Math.pow(10, decimals);
  const truncated = Math.trunc(value * factor) / factor;
  return truncated.toFixed(decimals);
};

const formatRatio = (value: number | null | undefined) => {
  if (value == null || !isFinite(value)) {
    return '—';
  }
  return `${formatNullable(value, 2)} : 1`;
};

const TradeLog: React.FC<TradeLogProps> = ({ trades, onDeleteTrade, onEditTrade }) => {
    
  const totals = useMemo(() => {
    return trades.reduce((acc, trade) => {
      acc.pnlNet += trade.pnlNet;
      acc.fees += trade.fees;
      acc.riskAmount += trade.riskAmount;
       acc.riskAmountActual += trade.riskAmountActual;
      acc.margin += trade.margin;
      return acc;
    }, { pnlNet: 0, fees: 0, riskAmount: 0, riskAmountActual: 0, margin: 0 });
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
              <HeaderCell label="Date" />
              <HeaderCell label="Pair" tooltip="Market traded (e.g., BTC/USDT). Helps compare performance by instrument." />
              <HeaderCell label="Direction" tooltip="Trade bias: Long (buy then sell) or Short (sell then buy back)." />
              <HeaderCell label="Entry" tooltip="Execution price of the entry order." />
              <HeaderCell label="Exit" tooltip="Execution price of the exit order." />
              <HeaderCell label="Closed" tooltip="Exact timestamp when the position was closed." />
              <HeaderCell label="Pos. Size" tooltip="Position size in asset units. Formula: (margin × leverage) ÷ entry price." />
              <HeaderCell label="Leverage" tooltip="Leverage multiplier applied to increase exposure (e.g., 5x)." />
              <HeaderCell label="Margin ($)" tooltip="Own capital allocated to the trade before leverage." />
              <HeaderCell label="R/R" tooltip="Risk-reward ratio recorded manually during trade planning (e.g., 2:1)." />
              <HeaderCell label="R:R Realized" tooltip="Actual return multiple: net P&L ÷ risk computed from the stop loss. Values >1 beat the risk taken." />
              <HeaderCell label="R:R Planned" tooltip="Theoretical reward-risk using TP and SL distances: distance to TP ÷ distance to SL." />
              <HeaderCell label="Risk % Config" tooltip="Risk percentage defined on the form, applied over the margin amount." />
              <HeaderCell label="Risk ($ %)" tooltip="Nominal risk based on the configured percentage. Formula: margin × leverage × (risk% ÷ 100)." />
              <HeaderCell label="Risk SL ($)" tooltip="Effective risk derived from the stop loss distance: |entry − SL| × position size." />
              <HeaderCell label="SL %" tooltip="Percent distance from entry to stop loss. ((Entry − SL)/Entry) × 100 for longs." />
              <HeaderCell label="TP %" tooltip="Percent distance from entry to take profit. ((TP − Entry)/Entry) × 100 for longs." />
              <HeaderCell label="Fees ($)" tooltip="Total commissions reported for the trade (entry + exit)." />
              <HeaderCell label="ROI %" tooltip="Return on margin: (net P&L ÷ margin) × 100. Reflects capital efficiency." />
              <HeaderCell label="P/L ($)" tooltip="Net profit or loss in USD after fees." />
              <HeaderCell label="P/L Asset %" tooltip="Underlying price change adjusted for direction: ((Exit − Entry)/Entry) × 100." />
              <HeaderCell label="P/L Margin %" tooltip="Return percentage on margin (identical to ROI %)." />
              <HeaderCell label="Capital Start" tooltip="Account equity before applying this trade result." />
              <HeaderCell label="Capital End" tooltip="Equity after adding the trade P&L. Forms the equity curve." />
              <HeaderCell label="Risk Cuenta %" tooltip="Risk over total account equity: (Risk SL $ ÷ trade starting capital) × 100." />
              <HeaderCell label="Strategy" tooltip="Strategy label used for the setup (Breakout, Swing, etc.)." />
              <HeaderCell label="Actions" />
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
                <td className="py-2 px-2">{formatRatio(trade.rrRealized)}</td>
                <td className="py-2 px-2">{formatRatio(trade.rrPlanned)}</td>
                <td className="py-2 px-2">{formatNullable(trade.riskPercent, 2)}%</td>
                <td className="py-2 px-2">{formatNumber(trade.riskAmount)}</td>
                <td className="py-2 px-2">{formatNumber(trade.riskAmountActual)}</td>
                <td className="py-2 px-2">{formatNullable(trade.stopLossPercent, 2)}%</td>
                <td className="py-2 px-2">{formatNullable(trade.takeProfitPercent, 2)}%</td>
                <td className="py-2 px-2">{formatNumber(trade.fees)}</td>
                <td className="py-2 px-2">{formatNullable(trade.roiPercent, 2)}%</td>
                <td className={`py-2 px-2 font-bold ${pnlColor(trade.pnlNet)}`}>{formatNumber(trade.pnlNet)}</td>
                <td className={`py-2 px-2 ${pnlColor(trade.pnlAssetPercent)}`}>{formatNumber(trade.pnlAssetPercent)}%</td>
                <td className={`py-2 px-2 ${pnlColor(trade.pnlMarginPercent)}`}>{formatNumber(trade.pnlMarginPercent)}%</td>
                <td className="py-2 px-2">{formatNumber(trade.capitalStart)}</td>
                <td className="py-2 px-2">{formatNumber(trade.capitalEnd)}</td>
                <td className="py-2 px-2">{formatNullable(trade.accountRiskPercent, 2)}%</td>
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
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2">{formatNumber(totals.riskAmount)}</td>
                <td className="py-2 px-2">{formatNumber(totals.riskAmountActual)}</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2">{formatNumber(totals.fees)}</td>
                <td className="py-2 px-2"></td>
                <td className={`py-2 px-2 ${pnlColor(totals.pnlNet)}`}>{formatNumber(totals.pnlNet)}</td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
                <td className="py-2 px-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

export default TradeLog;
