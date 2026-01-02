import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Type, LayoutGrid } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const memoryGames = [
    {
        id: 'alpha',
        name: 'Memoria Alfanumérica',
        icon: Type,
        color: 'text-violet-500',
        bg: 'bg-violet-50',
        desc: 'Recuerda una cadena de caracteres aleatorios'
    },
    {
        id: 'pattern',
        name: 'Patrón Visual',
        icon: LayoutGrid,
        color: 'text-fuchsia-500',
        bg: 'bg-fuchsia-50',
        desc: 'Repite el patrón de luces en el orden correcto'
    },
];

export const MemoryHome: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-4xl mb-8">
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> Volver al menú
                </Button>
            </div>

            <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-purple-600 text-white rounded-2xl mb-4 shadow-lg shadow-purple-200">
                    <Brain size={32} />
                </div>
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Entrenamiento de <span className="text-purple-600">Memoria</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-md mx-auto">
                    Mejora tu capacidad de retención visual y auditiva con estos desafíos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {memoryGames.map((game) => (
                    <Card
                        key={game.id}
                        hover
                        className="group cursor-pointer p-8 relative overflow-hidden border-purple-100"
                        onClick={() => navigate(`/memory/game/${game.id}`)}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${game.bg.replace('bg-', 'bg-')}`} />

                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl ${game.bg}`}>
                                <game.icon size={32} className={game.color} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{game.name}</h3>
                                <p className="text-gray-500 mt-1">{game.desc}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button variant="ghost" className="group-hover:translate-x-2 transition-transform text-purple-600">
                                Comenzar →
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
