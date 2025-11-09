export interface JournalUser {
  uid: string;
  email: string | null;
}

export interface Trade {
  id: string;
  dateTime: string;
  pair: string;
  strategy: string;
  direction: 'Long' | 'Short';
  riskReward: string;
  entryPrice: number;
  exitPrice: number;
  margin: number;
  leverage: number;
  riskPercent: number;
  fees: number;
}

export interface TradeWithPnl extends Trade {
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
