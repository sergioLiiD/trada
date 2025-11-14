
import { Trade, Capital, TradeWithPnl } from '../types';

export const calculateTradePnl = (trade: Trade) => {
  if (trade.status !== 'closed') {
    throw new Error('Cannot calculate PnL for an open trade');
  }

  const exitPrice = trade.exitPrice ?? trade.entryPrice;
  const fees = trade.fees ?? 0;

  const positionValue = trade.margin * trade.leverage;
  const positionSize = trade.entryPrice !== 0 ? positionValue / trade.entryPrice : 0;
  const directionMultiplier = trade.direction === 'Long' ? 1 : -1;

  const priceDelta = (exitPrice - trade.entryPrice) * directionMultiplier;
  const pnlGross = priceDelta * positionSize;
  const pnlNet = pnlGross - fees;
  const pnlAssetPercent = trade.entryPrice !== 0 ? (priceDelta / trade.entryPrice) * 100 : 0;
  const pnlMarginPercent = trade.margin !== 0 ? (pnlNet / trade.margin) * 100 : 0;
  const roiPercent = pnlMarginPercent;
  const riskAmount = positionValue * (trade.riskPercent / 100);

  const stopLossDistanceRaw = trade.stopLoss != null
    ? (trade.entryPrice - trade.stopLoss) * directionMultiplier
    : null;
  const hasValidStopLossDistance = stopLossDistanceRaw != null && stopLossDistanceRaw > 0;
  const riskAmountFromStopLoss = hasValidStopLossDistance ? stopLossDistanceRaw! * positionSize : null;
  const riskAmountActual = riskAmountFromStopLoss ?? riskAmount;
  const stopLossPercent = hasValidStopLossDistance && trade.entryPrice !== 0
    ? (stopLossDistanceRaw! / trade.entryPrice) * 100
    : null;

  const takeProfitDistanceRaw = trade.takeProfit != null
    ? (trade.takeProfit - trade.entryPrice) * directionMultiplier
    : null;
  const hasValidTakeProfitDistance = takeProfitDistanceRaw != null && takeProfitDistanceRaw > 0;
  const rewardAmountFromTakeProfit = hasValidTakeProfitDistance ? takeProfitDistanceRaw! * positionSize : null;
  const takeProfitPercent = hasValidTakeProfitDistance && trade.entryPrice !== 0
    ? (takeProfitDistanceRaw! / trade.entryPrice) * 100
    : null;

  const rrRealized = riskAmountActual > 0 ? pnlNet / riskAmountActual : null;
  const rrPlanned = hasValidStopLossDistance && riskAmountFromStopLoss && riskAmountFromStopLoss > 0 && rewardAmountFromTakeProfit
    ? rewardAmountFromTakeProfit / riskAmountFromStopLoss
    : null;

  return {
    pnlGross,
    pnlNet,
    pnlAssetPercent,
    pnlMarginPercent,
    roiPercent,
    positionSize,
    riskAmount,
    riskAmountActual,
    stopLossPercent,
    takeProfitPercent,
    rrRealized,
    rrPlanned,
  };
};

export const calculateDashboardMetrics = (capital: Capital, trades: TradeWithPnl[]) => {
  const totalPnl = trades.reduce((acc, trade) => acc + trade.pnlNet, 0);
  const currentCapital = capital.initial + capital.deposits + totalPnl;

  const winningTrades = trades.filter(t => t.pnlNet > 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

  const grossProfit = trades.filter(t => t.pnlNet > 0).reduce((sum, t) => sum + t.pnlNet, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnlNet < 0).reduce((sum, t) => sum + t.pnlNet, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;

  const roiValues = trades
    .map(t => t.roiPercent)
    .filter(value => value != null && isFinite(value)) as number[];
  const averageRoi = roiValues.length > 0
    ? roiValues.reduce((sum, value) => sum + value, 0) / roiValues.length
    : null;

  const rrValues = trades
    .map(t => t.rrRealized)
    .filter((value): value is number => value != null && isFinite(value));
  const averageRrRealized = rrValues.length > 0
    ? rrValues.reduce((sum, value) => sum + value, 0) / rrValues.length
    : null;

  const accountRiskValues = trades
    .map(t => t.accountRiskPercent ?? null)
    .filter((value): value is number => value != null && isFinite(value));
  const averageAccountRiskPercent = accountRiskValues.length > 0
    ? accountRiskValues.reduce((sum, value) => sum + value, 0) / accountRiskValues.length
    : null;

  return {
    currentCapital,
    totalPnl,
    winRate,
    profitFactor,
    averageRoi,
    averageRrRealized,
    averageAccountRiskPercent,
  };
};
