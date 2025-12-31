import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`
        w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 
        focus:border-indigo-500 focus:bg-white focus:outline-none transition-all
        text-2xl text-center font-bold tracking-wider text-gray-800
        ${className}
      `}
            {...props}
        />
    );
});

Input.displayName = 'Input';
