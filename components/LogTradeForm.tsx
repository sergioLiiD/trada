import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { Trade } from '../types';

interface LogTradeFormProps {
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
}

const INITIAL_STATE: Omit<Trade, 'id'> = {
  dateTime: new Date().toISOString().slice(0, 16),
  pair: '',
  strategy: '',
  direction: 'Long',
  riskReward: '2:1',
  entryPrice: 0,
  exitPrice: 0,
  margin: 0,
  leverage: 1,
  riskPercent: 1,
  fees: 0,
};

const LogTradeForm: React.FC<LogTradeFormProps> = ({ onAddTrade }) => {
  const [trade, setTrade] = useState(INITIAL_STATE);
  const [autoCalculated, setAutoCalculated] = useState({
    positionValue: 0,
    positionSize: 0,
    riskAmount: 0,
  });

  useEffect(() => {
    const positionValue = trade.margin * trade.leverage;
    const positionSize = trade.entryPrice > 0 ? positionValue / trade.entryPrice : 0;
    const riskAmount = positionValue * (trade.riskPercent / 100);
    setAutoCalculated({ positionValue, positionSize, riskAmount });
  }, [trade.margin, trade.leverage, trade.entryPrice, trade.riskPercent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['entryPrice', 'exitPrice', 'margin', 'leverage', 'riskPercent', 'fees'].includes(name);
    setTrade(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade(trade);
    setTrade(INITIAL_STATE);
  };

  return (
    <Card title="Log a New Trade">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date & Time</label>
            <input type="datetime-local" name="dateTime" id="dateTime" value={trade.dateTime} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="pair" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Pair</label>
            <input type="text" name="pair" id="pair" placeholder="e.g., BTC/USDT" value={trade.pair} onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="strategy" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Strategy</label>
                <input type="text" name="strategy" id="strategy" placeholder="e.g., Breakout" value={trade.strategy} onChange={handleChange} required className="input-field" />
            </div>
            <div>
                <label htmlFor="direction" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Direction</label>
                <select name="direction" id="direction" value={trade.direction} onChange={handleChange} className="input-field">
                <option value="Long">Long</option>
                <option value="Short">Short</option>
                </select>
            </div>
        </div>
        
        <div>
            <label htmlFor="riskReward" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Risk/Reward Ratio</label>
            <input type="text" name="riskReward" id="riskReward" placeholder="e.g., 2:1" value={trade.riskReward} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Entry Price</label>
            <input type="number" step="any" name="entryPrice" id="entryPrice" value={trade.entryPrice} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Exit Price</label>
            <input type="number" step="any" name="exitPrice" id="exitPrice" value={trade.exitPrice} onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="margin" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Margin ($)</label>
                <input type="number" step="any" name="margin" id="margin" value={trade.margin} onChange={handleChange} required className="input-field" />
            </div>
            <div>
                <label htmlFor="leverage" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Leverage</label>
                <select name="leverage" id="leverage" value={trade.leverage} onChange={handleChange} className="input-field">
                    {[...Array(100).keys()].map(i => <option key={i+1} value={i+1}>{i+1}x</option>)}
                </select>
            </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="riskPercent" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Risk (%)</label>
                <input type="number" step="any" name="riskPercent" id="riskPercent" value={trade.riskPercent} onChange={handleChange} required className="input-field" />
            </div>
            <div>
                <label htmlFor="fees" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Fees ($)</label>
                <input type="number" step="any" name="fees" id="fees" value={trade.fees} onChange={handleChange} required className="input-field" />
            </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Auto-Calculated Values</h3>
            <div className="flex justify-between"><span>Position Value ($):</span> <span>{autoCalculated.positionValue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Position Size (Asset):</span> <span>{autoCalculated.positionSize.toFixed(8)}</span></div>
            <div className="flex justify-between"><span>Risk Amount ($):</span> <span>{autoCalculated.riskAmount.toFixed(2)}</span></div>
        </div>

        <button type="submit" className="w-full bg-primary hover:brightness-95 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300">
          Log Trade
        </button>
      </form>
      {/* Fix: Removed the non-standard `jsx` prop from the <style> tag. */}
      <style>{`
        .input-field {
            margin-top: 4px;
            display: block;
            width: 100%;
            background-color: rgb(249 250 251);
            border: 1px solid rgb(209 213 219);
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            padding: 0.5rem 0.75rem;
            color: rgb(17 24 39);
        }
        .dark .input-field {
            background-color: rgb(17 24 39);
            border-color: rgb(55 65 81);
            color: rgb(249 250 251);
        }
        .input-field:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            --tw-ring-color: var(--color-primary);
            border-color: var(--color-primary);
        }
      `}</style>
    </Card>
  );
};

export default LogTradeForm;
