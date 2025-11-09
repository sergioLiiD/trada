import React, { useState, useMemo } from 'react';

// Types
import { JournalUser, Trade, Capital, Note, TradeWithPnl, DashboardMetrics } from '../types';

// Hooks
import { useFirestoreCollection, useFirestoreDocument } from '../hooks/useFirestore';

// Utils
import { calculateTradePnl, calculateDashboardMetrics } from '../utils/calculations';

// Components
import CapitalManagement from './CapitalManagement';
import LogTradeForm from './LogTradeForm';
import PerformanceDashboard from './PerformanceDashboard';
import TradeLog from './TradeLog';
import PersonalNotes from './PersonalNotes';
import BestPractices from './BestPractices';
import PerformanceAnalyticsModal from './PerformanceAnalyticsModal';
import PromptModal from './PromptModal';

interface TradingJournalProps {
  user: JournalUser;
  logout: () => void;
  theme: string;
  toggleTheme: () => void;
}

const TradingJournal: React.FC<TradingJournalProps> = ({ user, logout, theme, toggleTheme }) => {
  const [isAnalyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [isPromptModalOpen, setPromptModalOpen] = useState(false);
  
  // Firestore data
  const { data: trades, addDocument: addTrade, deleteDocument: deleteTrade, loading: tradesLoading } = useFirestoreCollection<Trade>('trades', user.uid);
  const { data: capital, updateDocument: updateCapital, loading: capitalLoading } = useFirestoreDocument<Capital>('capital', user.uid, { initial: 1000, deposits: 0 });
  const { data: note, updateDocument: updateNote, loading: noteLoading } = useFirestoreDocument<Note>('note', user.uid, { content: 'Start typing your notes here...', color: 'default' });

  const loading = tradesLoading || capitalLoading || noteLoading;

  const tradesWithPnl: TradeWithPnl[] = useMemo(() => {
    let runningCapital = capital.initial + capital.deposits;
    return trades
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .map(trade => {
        const pnlData = calculateTradePnl(trade);
        const tradeWithPnl = { ...trade, ...pnlData };
        runningCapital += tradeWithPnl.pnlNet;
        return { ...tradeWithPnl, capitalEnd: runningCapital };
      });
  }, [trades, capital]);

  const dashboardMetrics: DashboardMetrics = useMemo(() => {
    return calculateDashboardMetrics(capital, tradesWithPnl);
  }, [capital, tradesWithPnl]);

  const handleAddTrade = (trade: Omit<Trade, 'id'>) => {
    addTrade(trade);
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
            <div className="flex items-center space-x-4">
              <button onClick={() => setPromptModalOpen(true)} className="text-sm font-medium text-primary hover:underline hidden md:block">
                  View Creation Prompt
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

        <main className="container mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
              <CapitalManagement 
                capital={capital} 
                setCapital={handleSetCapital}
                onAddDeposit={handleAddDeposit}
              />
              <BestPractices />
              <PersonalNotes 
                note={note}
                onNoteChange={handleNoteChange}
              />
              <LogTradeForm onAddTrade={handleAddTrade} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6 mt-6 lg:mt-0">
              <PerformanceDashboard metrics={dashboardMetrics} onOpenAnalytics={() => setAnalyticsModalOpen(true)} />
              <TradeLog trades={tradesWithPnl} onDeleteTrade={handleDeleteTrade} />
            </div>
          </div>
        </main>
      </div>

      {isAnalyticsModalOpen && <PerformanceAnalyticsModal 
        onClose={() => setAnalyticsModalOpen(false)} 
        trades={tradesWithPnl}
        capital={capital}
      />}
      
      {isPromptModalOpen && <PromptModal onClose={() => setPromptModalOpen(false)} />}
    </>
  );
};

export default TradingJournal;
