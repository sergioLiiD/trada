import React, { useState, useMemo } from 'react';

// Types
import { JournalUser, Trade, Capital, Note, TradeWithPnl, DashboardMetrics } from '../types';

// Hooks
import { useFirestoreCollection, useFirestoreDocument } from '../hooks/useFirestore';

// Utils
import { calculateTradePnl, calculateDashboardMetrics } from '../utils/calculations';

// Components
import CapitalManagement from './CapitalManagement';
import PerformanceDashboard from './PerformanceDashboard';
import TradeLog from './TradeLog';
import PersonalNotes from './PersonalNotes';
import BestPractices from './BestPractices';
import PerformanceAnalyticsModal from './PerformanceAnalyticsModal';
import PromptModal from './PromptModal';
import EditTradeModal from './EditTradeModal';
import OpenPositions from './OpenPositions';
import LogTradeModal from './LogTradeModal';

interface TradingJournalProps {
  user: JournalUser;
  logout: () => void;
  theme: string;
  toggleTheme: () => void;
}

const TradingJournal: React.FC<TradingJournalProps> = ({ user, logout, theme, toggleTheme }) => {
  const [isAnalyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [isPromptModalOpen, setPromptModalOpen] = useState(false);
  const [tradeBeingEdited, setTradeBeingEdited] = useState<Trade | null>(null);
  const [isLogTradeModalOpen, setLogTradeModalOpen] = useState(false);
  
  // Firestore data
  const { data: trades, addDocument: addTrade, deleteDocument: deleteTrade, updateDocument: updateTrade, loading: tradesLoading } = useFirestoreCollection<Trade>('trades', user.uid);
  const { data: capital, updateDocument: updateCapital, loading: capitalLoading } = useFirestoreDocument<Capital>('capital', user.uid, { initial: 1000, deposits: 0 });
  const { data: note, updateDocument: updateNote, loading: noteLoading } = useFirestoreDocument<Note>('note', user.uid, { content: 'Start typing your notes here...', color: 'default' });

  const loading = tradesLoading || capitalLoading || noteLoading;

  const normalizedTrades = useMemo(() => {
    return trades.map(trade => ({
      ...trade,
      status: (trade.status ?? 'closed') as Trade['status'],
    }));
  }, [trades]);

  const openTrades = useMemo(() => {
    return normalizedTrades.filter(trade => trade.status === 'open');
  }, [normalizedTrades]);

  const closedTrades = useMemo(() => {
    return normalizedTrades.filter(trade => trade.status === 'closed');
  }, [normalizedTrades]);

  const tradesWithPnl: TradeWithPnl[] = useMemo(() => {
    let runningCapital = capital.initial + capital.deposits;
    return closedTrades
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .map(trade => {
        const capitalStart = runningCapital;
        const pnlData = calculateTradePnl(trade);
        const effectiveRiskAmount = pnlData.riskAmountActual ?? pnlData.riskAmount;
        const accountRiskPercent = capitalStart > 0 ? (effectiveRiskAmount / capitalStart) * 100 : null;
        const tradeWithPnl: TradeWithPnl = {
          ...trade,
          ...pnlData,
          status: 'closed',
          exitPrice: trade.exitPrice ?? trade.entryPrice,
          fees: trade.fees ?? 0,
          capitalStart,
          accountRiskPercent,
        };
        runningCapital += tradeWithPnl.pnlNet;
        return { ...tradeWithPnl, capitalEnd: runningCapital };
      });
  }, [closedTrades, capital]);

  const dashboardMetrics: DashboardMetrics = useMemo(() => {
    return calculateDashboardMetrics(capital, tradesWithPnl);
  }, [capital, tradesWithPnl]);

  const handleAddTrade = async (trade: Omit<Trade, 'id'>) => {
    await addTrade(trade);
  };

  const handleSetCapital = (newCapital: Partial<Capital>) => {
    updateCapital(newCapital);
  };
  
  const handleAddDeposit = (amount: number) => {
    updateCapital({ deposits: (capital.deposits || 0) + amount });
  };
  
  const handleNoteChange = (newNote: Note) => {
    updateNote(newNote);
  };

  const handleDeleteTrade = (tradeId: string) => {
    deleteTrade(tradeId);
  };

  const handleStartEditTrade = (tradeId: string) => {
    const tradeToEdit = trades.find((trade) => trade.id === tradeId);
    if (tradeToEdit) {
      setTradeBeingEdited(tradeToEdit);
    }
  };

  const handleUpdateTrade = (tradeId: string, updatedTrade: Omit<Trade, 'id'>) => {
    return updateTrade(tradeId, updatedTrade);
  };

  const handleCloseEdit = () => {
    setTradeBeingEdited(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl font-bold">Loading Journal...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-300">
        <header className="bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50 shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">TRADA</h1>
            <div className="flex items-center space-x-3">
              <button onClick={() => setPromptModalOpen(true)} className="text-sm font-medium text-primary hover:underline hidden md:block">
                  View Creation Prompt
              </button>
              <button
                onClick={() => setLogTradeModalOpen(true)}
                className="hidden md:inline-flex items-center bg-primary hover:brightness-95 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
              >
                Log Trade
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-2xl leading-none">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={logout} className="bg-primary hover:brightness-95 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4 lg:p-6 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CapitalManagement 
              capital={capital} 
              setCapital={handleSetCapital}
              onAddDeposit={handleAddDeposit}
            />
            <PerformanceDashboard metrics={dashboardMetrics} onOpenAnalytics={() => setAnalyticsModalOpen(true)} />
            <BestPractices />
            <PersonalNotes 
              note={note}
              onNoteChange={handleNoteChange}
            />
            <button
              onClick={() => setLogTradeModalOpen(true)}
              className="w-full bg-primary hover:brightness-95 text-gray-900 font-bold py-3 px-4 rounded-md transition duration-300 text-sm xl:col-span-2"
            >
              Log a New Trade
            </button>
          </div>

          <div className="space-y-6">
            <OpenPositions trades={openTrades} onEditTrade={handleStartEditTrade} onDeleteTrade={handleDeleteTrade} />
            <TradeLog trades={tradesWithPnl} onDeleteTrade={handleDeleteTrade} onEditTrade={handleStartEditTrade} />
          </div>
        </main>
      </div>

      {isAnalyticsModalOpen && <PerformanceAnalyticsModal 
        onClose={() => setAnalyticsModalOpen(false)} 
        trades={tradesWithPnl}
        capital={capital}
      />}
      
      {isPromptModalOpen && <PromptModal onClose={() => setPromptModalOpen(false)} />}

      {tradeBeingEdited && (
        <EditTradeModal
          trade={tradeBeingEdited}
          onClose={handleCloseEdit}
          onSubmit={handleUpdateTrade}
        />
      )}

      {isLogTradeModalOpen && (
        <LogTradeModal
          onClose={() => setLogTradeModalOpen(false)}
          onSubmit={handleAddTrade}
        />
      )}
    </>
  );
};

export default TradingJournal;
