
import { Trade, Capital, TradeWithPnl } from '../types';

export const calculateTradePnl = (trade: Trade) => {
  const positionValue = trade.margin * trade.leverage;
  const positionSize = positionValue / trade.entryPrice;
  const directionMultiplier = trade.direction === 'Long' ? 1 : -1;

  const pnlNet = (trade.exitPrice - trade.entryPrice) * positionSize * directionMultiplier - trade.fees;
  const pnlAssetPercent = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * directionMultiplier * 100;
  const pnlMarginPercent = (pnlNet / trade.margin) * 100;
  const riskAmount = positionValue * (trade.riskPercent / 100);

  return { pnlNet, pnlAssetPercent, pnlMarginPercent, positionSize, riskAmount };
};

export const calculateDashboardMetrics = (capital: Capital, trades: TradeWithPnl[]) => {
  const totalPnl = trades.reduce((acc, trade) => acc + trade.pnlNet, 0);
  const currentCapital = capital.initial + capital.deposits + totalPnl;

  const winningTrades = trades.filter(t => t.pnlNet > 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

  const grossProfit = trades.filter(t => t.pnlNet > 0).reduce((sum, t) => sum + t.pnlNet, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnlNet < 0).reduce((sum, t) => sum + t.pnlNet, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;

  return { currentCapital, totalPnl, winRate, profitFactor };
};
