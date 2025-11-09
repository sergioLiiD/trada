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
  status: TradeStatus;
  closeDateTime?: string | null;
  notes?: string;
}

export interface TradeWithPnl extends Trade {
  status: 'closed';
  exitPrice: number;
  fees: number;
  pnlNet: number;
  pnlAssetPercent: number;
  pnlMarginPercent: number;
  positionSize: number;
  riskAmount: number;
  capitalEnd: number;
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
}

export interface Note {
  content: string;
  color: string;
}
