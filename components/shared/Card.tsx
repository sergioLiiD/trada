import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-lg p-6 ${className}`}>
      {title && <h2 className={`text-xl font-bold mb-4 text-primary ${titleClassName}`}>{title}</h2>}
      {children}
    </div>
  );
};

export default Card;