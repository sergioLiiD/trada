import React from 'react';
import { Trade } from '../types';
import LogTradeForm from './LogTradeForm';

interface LogTradeModalProps {
  onClose: () => void;
  onSubmit: (trade: Omit<Trade, 'id'>) => Promise<void> | void;
}

const LogTradeModal: React.FC<LogTradeModalProps> = ({ onClose, onSubmit }) => {
  const handleSubmit = async (trade: Omit<Trade, 'id'>) => {
    await onSubmit(trade);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">Log a New Trade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </header>
        <main className="p-6">
          <LogTradeForm onSubmit={handleSubmit} submitLabel="Save Trade" onCancel={onClose} title="Trade Details" />
        </main>
      </div>
    </div>
  );
};

export default LogTradeModal;

