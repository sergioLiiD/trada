import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import { Capital } from '../types';

interface CapitalManagementProps {
  capital: Capital;
  setCapital: (capital: Partial<Capital>) => void;
  onAddDeposit: (amount: number) => void;
}

const CapitalManagement: React.FC<CapitalManagementProps> = ({ capital, setCapital, onAddDeposit }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deposit, setDeposit] = useState('');
  
  // Local state for the input field to provide instant UI feedback
  const [localInitial, setLocalInitial] = useState(capital.initial.toString());

  // Effect to sync local state when the prop changes from Firestore
  useEffect(() => {
    setLocalInitial(capital.initial.toString());
  }, [capital.initial]);

  const handleDeposit = () => {
    const amount = parseFloat(deposit);
    if (!isNaN(amount) && amount > 0) {
      onAddDeposit(amount);
      setDeposit('');
    }
  };
  
  // onChange now only updates the local, responsive state
  const handleInitialCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalInitial(e.target.value);
  }
  
  // onBlur persists the final change to Firestore
  const handleInitialCapitalBlur = () => {
    const value = parseFloat(localInitial);
    const finalValue = isNaN(value) ? 0 : value;
    // Only send an update if the value has actually changed
    if (finalValue !== capital.initial) {
        setCapital({ initial: finalValue });
    }
  }

  return (
    <Card>
      <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center cursor-pointer">
        <h2 className="text-xl font-bold text-primary">Capital Management</h2>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
      </div>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
        <div className="space-y-4">
          <div>
            <label htmlFor="initialCapital" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Initial Capital ($)
            </label>
            <input
              type="number"
              id="initialCapital"
              value={localInitial}
              onChange={handleInitialCapitalChange}
              onBlur={handleInitialCapitalBlur}
              className="mt-1 block w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="e.g., 1000"
            />
          </div>
          <div className="flex items-end space-x-2">
            <div className="flex-grow">
              <label htmlFor="addDeposit" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                Add Deposit ($)
              </label>
              <input
                type="number"
                id="addDeposit"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="mt-1 block w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-800 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., 500"
              />
            </div>
            <button
              onClick={handleDeposit}
              className="bg-primary hover:brightness-95 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 h-10"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CapitalManagement;