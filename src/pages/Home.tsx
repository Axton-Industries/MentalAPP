import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Divide, Zap, Square, ArrowLeft, Calculator, Brain, Hash } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const operations = [
    { id: 'sum', name: 'Sumas', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'sub', name: 'Restas', icon: Minus, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'mul', name: 'Multiplicación', icon: X, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'div', name: 'División', icon: Divide, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'pow', name: 'Potencias', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'sqrt', name: 'Raíces', icon: Square, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'mixed', name: 'Combinado', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'dec', name: 'Decimales', icon: Hash, color: 'text-gray-600', bg: 'bg-gray-100' },
];

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center py-8 md:py-12 px-4">
            <div className="w-full max-w-4xl mb-6 md:mb-8">
                <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-4" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> <span className="text-sm md:text-base">Volver al menú</span>
                </Button>
            </div>

            <div className="text-center mb-10 md:mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg shadow-indigo-200">
                    <Calculator className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Cálculo <span className="text-indigo-600">Mental</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto">
                    Selecciona una operación para empezar a entrenar tu rapidez numérica.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                {operations.map((op) => (
                    <Card
                        key={op.id}
                        hover
                        className="group cursor-pointer p-6 md:p-8 relative overflow-hidden"
                        onClick={() => navigate(`/game/${op.id}`)}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${op.bg}`} />

                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                            <div className={`p-3 md:p-4 rounded-2xl ${op.bg} shrink-0`}>
                                <op.icon className={`w-6 h-6 md:w-8 md:h-8 ${op.color}`} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{op.name}</h3>
                                <p className="text-sm md:text-base text-gray-500 mt-1">Practicar {op.name.toLowerCase()}</p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-8 flex justify-end relative z-10">
                            <Button variant="ghost" className="group-hover:translate-x-2 transition-transform text-indigo-600 text-sm md:text-base">
                                Comenzar →
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
