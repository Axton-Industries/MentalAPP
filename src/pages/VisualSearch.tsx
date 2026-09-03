import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Star, RotateCcw, Home as HomeIcon, Zap, Trophy } from 'lucide-react';
import { useVisualSearch } from '../hooks/useVisualSearch';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const VisualSearch = () => {
    const navigate = useNavigate();
    const {
        grid, score, difficulty, streak, isGameOver,
        timeLeft, startGame, clickCell, getTargetEmoji, getTargetsLeft,
    } = useVisualSearch();

    useEffect(() => {
        startGame();
    }, []);

    if (isGameOver) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-6 sm:p-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl sm:text-4xl">🔍</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">¡Tiempo agotado!</h2>
                    <p className="text-lg sm:text-xl text-gray-500 mb-6 sm:mb-8">Has conseguido una puntuación de:</p>
                    <div className="text-6xl sm:text-7xl font-black text-emerald-600 mb-8 sm:mb-12">{score}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Button variant="outline" className="flex items-center justify-center gap-2 py-3 sm:py-4" onClick={startGame}>
                            <RotateCcw size={20} /> Reintentar
                        </Button>
                        <Button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/focus')}>
                            <HomeIcon size={20} /> Menú
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex flex-col items-center p-2 sm:p-4">
            <div className="w-full max-w-5xl flex items-center justify-between mb-4 md:mb-8 flex-wrap gap-2 sm:gap-4">
                <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4" onClick={() => navigate('/focus')}>
                    <ArrowLeft size={18} /> <span className="text-sm sm:text-base">Volver</span>
                </Button>
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center flex-1 sm:flex-none">
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border-emerald-100">
                        <Star size={16} className="text-emerald-600 sm:w-5 sm:h-5" />
                        <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-tighter hidden xs:inline">Nivel</span>
                        <span className="text-base sm:text-xl font-black text-emerald-600">{difficulty + 1}</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border-amber-100">
                        <Zap size={16} className="text-amber-500 fill-amber-500 sm:w-5 sm:h-5" />
                        <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-tighter hidden xs:inline">Racha</span>
                        <span className="text-base sm:text-xl font-black text-amber-600">{streak}/3</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4">
                        <Timer size={16} className="text-emerald-600 sm:w-5 sm:h-5" />
                        <span className="text-base sm:text-xl font-bold font-mono">{timeLeft}s</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4">
                        <Trophy size={16} className="text-amber-500 sm:w-5 sm:h-5" />
                        <span className="text-base sm:text-xl font-bold font-mono">{score}</span>
                    </Card>
                </div>
            </div>

            <Card className="max-w-2xl w-full p-4 sm:p-8">
                <div className="flex flex-col items-center">
                    <p className="text-sm sm:text-base text-gray-400 uppercase tracking-widest font-bold mb-2">
                        Encuentra todos los
                    </p>
                    <div className="text-4xl sm:text-5xl mb-6">{getTargetEmoji()}</div>
                    <p className="text-xs sm:text-sm text-emerald-600 font-bold mb-6">
                        Quedan {getTargetsLeft()}
                    </p>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 w-full max-w-md">
                        {grid.map((cell) => (
                            <button
                                key={cell.id}
                                onClick={() => clickCell(cell.id)}
                                disabled={cell.found}
                                className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-200 ${
                                    cell.found
                                        ? 'bg-emerald-100 border-2 border-emerald-400 scale-95'
                                        : 'bg-white border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md active:scale-90 cursor-pointer'
                                }`}
                            >
                                {cell.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <p className="mt-8 text-sm sm:text-base text-gray-400 text-center animate-pulse">
                Haz clic en todas las instancias del emoji objetivo
            </p>
        </div>
    );
};
