import React from 'react';
import { InlineMath } from 'react-katex';

interface MathRendererProps {
    math: string;
    className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ math, className = '' }) => {
    return (
        <div className={`inline-flex items-center justify-center font-normal ${className}`}>
            <InlineMath math={math} />
        </div>
    );
};
