import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, X, Divide, Zap, Square, ArrowLeft, Calculator } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const operations = [
    { id: 'sum', name: 'Sumas', icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'sub', name: 'Restas', icon: Minus, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'mul', name: 'Multiplicación', icon: X, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'div', name: 'División', icon: Divide, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'pow', name: 'Potencias', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'sqrt', name: 'Raíces', icon: Square, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl mb-8">
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> Volver al menú
                </Button>
            </div>

            <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <Calculator size={32} />
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Cálculo <span className="text-indigo-600">Mental</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-md mx-auto">
                    Selecciona una operación para empezar a entrenar tu rapidez numérica.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {operations.map((op) => (
                    <Card
                        key={op.id}
                        hover
                        className="group cursor-pointer p-8 relative overflow-hidden"
                        onClick={() => navigate(`/game/${op.id}`)}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${op.bg.replace('bg-', 'bg-')}`} />

                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl ${op.bg}`}>
                                <op.icon size={32} className={op.color} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{op.name}</h3>
                                <p className="text-gray-500 mt-1">Practicar {op.name.toLowerCase()}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button variant="ghost" className="group-hover:translate-x-2 transition-transform">
                                Comenzar défi →
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
