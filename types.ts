export interface JournalUser {
  uid: string;
  email: string | null;
}

export type TradeStatus = 'open' | 'closed';

export interface Trade {
  id: string;
  dateTime: string;
  pair: string;
  strategy: string;
  direction: 'Long' | 'Short';
  riskReward: string;
  entryPrice: number;
  exitPrice?: number | null;
  margin: number;
  leverage: number;
  riskPercent: number;
  fees?: number | null;
  feePercent?: number | null;
  stopLoss?: number | null;
  takeProfit?: number | null;
  status: TradeStatus;
  closeDateTime?: string | null;
  notes?: string;
}

export interface TradeWithPnl extends Trade {
  status: 'closed';
  exitPrice: number;
  fees: number;
  pnlGross: number;
  pnlNet: number;
  pnlAssetPercent: number;
  pnlMarginPercent: number;
  roiPercent: number;
  rrRealized: number | null;
  rrPlanned: number | null;
  positionSize: number;
  riskAmount: number;
  riskAmountActual: number;
  stopLossPercent?: number | null;
  takeProfitPercent?: number | null;
  capitalStart: number;
  capitalEnd: number;
  accountRiskPercent?: number | null;
}

export interface Capital {
  initial: number;
  deposits: number;
}

export interface DashboardMetrics {
  currentCapital: number;
  totalPnl: number;
  winRate: number;
  profitFactor: number;
  averageRoi: number | null;
  averageRrRealized: number | null;
  averageAccountRiskPercent: number | null;
}

export interface Note {
  content: string;
  color: string;
}
