import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Hash, RotateCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const logicGames = [
    {
        id: 'sequences',
        name: 'Secuencias Numéricas',
        icon: Hash,
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        desc: 'Descubre el patrón y completa la serie'
    },
    {
        id: 'rotation',
        name: 'Rotación Mental',
        icon: RotateCw,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        desc: 'Identifica la forma rotada visualizando mentalmente'
    },
];

export const LogicHome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center py-8 md:py-12 px-4">
            <div className="w-full max-w-4xl mb-6 md:mb-8">
                <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-4" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} /> <span className="text-sm md:text-base">Volver al menú</span>
                </Button>
            </div>

            <div className="text-center mb-10 md:mb-16 animate-fade-in">
                <div className="inline-flex items-center justify-center p-3 bg-amber-600 text-white rounded-2xl mb-4 shadow-lg shadow-amber-200">
                    <Compass className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Entrenamiento de <span className="text-amber-600">Lógica</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto px-4">
                    Desarrolla tu razonamiento deductivo, patrones y habilidades espaciales.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                {logicGames.map((game) => (
                    <Card
                        key={game.id}
                        hover
                        className="group cursor-pointer p-6 md:p-8 relative overflow-hidden border-amber-100"
                        onClick={() => navigate(`/logic/game/${game.id}`)}
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
                            <Button variant="ghost" className="group-hover:translate-x-2 transition-transform text-amber-600 text-sm md:text-base">
                                Comenzar →
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
