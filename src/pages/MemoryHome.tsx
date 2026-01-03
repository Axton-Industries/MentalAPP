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
        <div className="min-h-[85vh] flex flex-col items-center py-8 md:py-12 px-4">
            <div className="w-full max-w-4xl mb-6 md:mb-8">
                <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-4" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> <span className="text-sm md:text-base">Volver al menú</span>
                </Button>
            </div>

            <div className="text-center mb-10 md:mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-purple-600 text-white rounded-2xl mb-4 shadow-lg shadow-purple-200">
                    <Brain className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight px-4">
                    Entrenamiento de <span className="text-purple-600">Memoria</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto px-4">
                    Mejora tu capacidad de retención visual y auditiva con estos desafíos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                {memoryGames.map((game) => (
                    <Card
                        key={game.id}
                        hover
                        className="group cursor-pointer p-6 md:p-8 relative overflow-hidden border-purple-100"
                        onClick={() => navigate(`/memory/game/${game.id}`)}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500 ${game.bg}`} />

                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                            <div className={`p-3 md:p-4 rounded-2xl ${game.bg} shrink-0`}>
                                <game.icon className={`w-6 h-6 md:w-8 md:h-8 ${game.color}`} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{game.name}</h3>
                                <p className="text-sm md:text-base text-gray-500 mt-1">{game.desc}</p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-8 flex justify-end relative z-10">
                            <Button variant="ghost" className="group-hover:translate-x-2 transition-transform text-purple-600 text-sm md:text-base">
                                Comenzar →
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
