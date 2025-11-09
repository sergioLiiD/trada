import React from 'react';
import Card from './shared/Card';

const BestPractices: React.FC = () => {
  const practices = [
    "Log every trade, win or lose.",
    "Be honest with your reasons for entry and exit.",
    "Analyze your emotional state during the trade.",
    "Review your journal weekly to find patterns.",
    "Consistency is more important than perfection."
  ];

  return (
    <Card title="Journaling Best Practices">
      <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
        {practices.map((practice, index) => (
          <li key={index}>{practice}</li>
        ))}
      </ul>
    </Card>
  );
};

export default BestPractices;