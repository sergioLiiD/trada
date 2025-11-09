import React from 'react';
import { Trade } from '../types';
import LogTradeForm from './LogTradeForm';

interface EditTradeModalProps {
  trade: Trade;
  onClose: () => void;
  onSubmit: (tradeId: string, updatedTrade: Omit<Trade, 'id'>) => Promise<void> | void;
}

const EditTradeModal: React.FC<EditTradeModalProps> = ({ trade, onClose, onSubmit }) => {
  const handleSubmit = async (updatedTrade: Omit<Trade, 'id'>) => {
    await onSubmit(trade.id, updatedTrade);
    onClose();
  };

  const { id: _id, ...initialValues } = trade;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">Edit Trade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl">&times;</button>
        </header>
        <main className="p-6">
          <LogTradeForm
            initialValues={initialValues}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </main>
      </div>
    </div>
  );
};

export default EditTradeModal;

