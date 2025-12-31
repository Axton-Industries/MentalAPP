import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
      bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl 
      ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''} 
      ${className}
    `}>
            {children}
        </div>
    );
};
