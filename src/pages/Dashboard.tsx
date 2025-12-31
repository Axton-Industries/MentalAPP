import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Brain, Target, Compass, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';

const categories = [
    {
        id: 'math',
        name: 'Cálculo Mental',
        description: 'Sumas, restas, multiplicaciones y más para agilizar tu mente.',
        icon: Calculator,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        path: '/cuentas',
        available: true
    },
    {
        id: 'memory',
        name: 'Memoria',
        description: 'Desafíos para mejorar tu retención visual y auditiva.',
        icon: Brain,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        path: '/memory',
        available: false
    },
    {
        id: 'focus',
        name: 'Atención',
        description: 'Ejercicios de concentración y agudeza visual.',
        icon: Target,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        path: '/focus',
        available: false
    },
    {
        id: 'logic',
        name: 'Lógica',
        description: 'Aciertijos y problemas de razonamiento lateral.',
        icon: Compass,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        path: '/logic',
        available: false
    }
];

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl mb-6 shadow-lg shadow-indigo-200">
                    <Zap size={40} fill="currentColor" />
                </div>
                <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tight">
                    Mental<span className="text-indigo-600">App</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Entrena tu cerebro diariamente con ejercicios diseñados para mejorar tus habilidades cognitivas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {categories.map((cat) => (
                    <Card
                        key={cat.id}
                        hover
                        className={`group cursor-pointer p-8 transition-all duration-300 ${!cat.available && 'opacity-60 cursor-not-allowed grayscale'}`}
                        onClick={() => cat.available && navigate(cat.path)}
                    >
                        <div className="flex items-start gap-6">
                            <div className={`p-5 rounded-2xl ${cat.bg} ${cat.color} transition-transform group-hover:scale-110 duration-300`}>
                                <cat.icon size={40} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">{cat.name}</h3>
                                    {!cat.available && (
                                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-500 rounded">
                                            Próximamente
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {cat.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
