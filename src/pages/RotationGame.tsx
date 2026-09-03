import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Star, RotateCcw, Home as HomeIcon, Zap, Trophy } from 'lucide-react';
import { useRotation } from '../hooks/useRotation';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const ShapeGrid = ({ grid, className = '' }: { grid: number[][]; className?: string }) => {
    const size = grid.length;
    return (
        <div className={`grid gap-1 ${className}`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {grid.flat().map((cell, i) => (
                <div
                    key={i}
                    className={`aspect-square rounded-sm ${cell ? 'bg-gray-800' : 'bg-gray-100'}`}
                />
            ))}
        </div>
    );
};

export const RotationGame = () => {
    const navigate = useNavigate();
    const {
        referenceShape, options, correctIndex, selectedIndex,
        score, difficulty, streak, isGameOver,
        timeLeft, startGame, submitAnswer,
    } = useRotation();

    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        startGame();
    }, []);

    const handleAnswer = (index: number) => {
        if (isGameOver || selectedIndex !== null) return;

        const isCorrect = submitAnswer(index);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => setFeedback(null), 500);
    };

    if (isGameOver) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-6 sm:p-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl sm:text-4xl">🔄</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">¡Tiempo agotado!</h2>
                    <p className="text-lg sm:text-xl text-gray-500 mb-6 sm:mb-8">Has conseguido una puntuación de:</p>
                    <div className="text-6xl sm:text-7xl font-black text-amber-600 mb-8 sm:mb-12">{score}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Button variant="outline" className="flex items-center justify-center gap-2 py-3 sm:py-4" onClick={startGame}>
                            <RotateCcw size={20} /> Reintentar
                        </Button>
                        <Button className="flex items-center justify-center gap-2 py-3 sm:py-4 bg-amber-600 hover:bg-amber-700" onClick={() => navigate('/logic')}>
                            <HomeIcon size={20} /> Menú
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (!referenceShape.length) return null;

    return (
        <div className="min-h-[85vh] flex flex-col items-center p-2 sm:p-4">
            <div className="w-full max-w-5xl flex items-center justify-between mb-4 md:mb-8 flex-wrap gap-2 sm:gap-4">
                <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4" onClick={() => navigate('/logic')}>
                    <ArrowLeft size={18} /> <span className="text-sm sm:text-base">Volver</span>
                </Button>
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center flex-1 sm:flex-none">
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border-amber-100">
                        <Star size={16} className="text-amber-600 sm:w-5 sm:h-5" />
                        <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-tighter hidden xs:inline">Nivel</span>
                        <span className="text-base sm:text-xl font-black text-amber-600">{difficulty + 1}</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4 border-emerald-100">
                        <Zap size={16} className="text-emerald-500 fill-emerald-500 sm:w-5 sm:h-5" />
                        <span className="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-tighter hidden xs:inline">Racha</span>
                        <span className="text-base sm:text-xl font-black text-emerald-600">{streak}/3</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4">
                        <Timer size={16} className="text-amber-600 sm:w-5 sm:h-5" />
                        <span className="text-base sm:text-xl font-bold font-mono">{timeLeft}s</span>
                    </Card>
                    <Card className="flex items-center gap-1 sm:gap-2 py-1.5 px-3 sm:py-2 sm:px-4">
                        <Trophy size={16} className="text-amber-500 sm:w-5 sm:h-5" />
                        <span className="text-base sm:text-xl font-bold font-mono">{score}</span>
                    </Card>
                </div>
            </div>

            <Card className={`max-w-2xl w-full p-6 sm:p-12 transition-all duration-300 ${feedback === 'correct' ? 'ring-4 ring-emerald-500 bg-emerald-50' :
                feedback === 'wrong' ? 'ring-4 ring-red-500 bg-red-50' : ''
                }`}>
                <div className="flex flex-col items-center">
                    <p className="text-sm sm:text-base text-gray-400 uppercase tracking-widest font-bold mb-6 sm:mb-8">
                        ¿Cuál es la misma forma rotada?
                    </p>

                    <div className="mb-8 sm:mb-12">
                        <p className="text-xs text-gray-400 text-center mb-2 uppercase tracking-widest">Original</p>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border-2 border-gray-100">
                            <ShapeGrid grid={referenceShape} className="w-24 h-24 sm:w-32 sm:h-32" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg">
                        {options.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={selectedIndex !== null}
                                className={`p-4 sm:p-6 rounded-2xl transition-all duration-200 active:scale-95 border-2 flex items-center justify-center ${
                                    selectedIndex !== null
                                        ? i === correctIndex
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : i === selectedIndex
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-100 bg-gray-50 opacity-50'
                                        : 'border-gray-100 bg-white hover:border-amber-300 hover:shadow-md cursor-pointer'
                                }`}
                            >
                                <ShapeGrid grid={option.grid} className="w-16 h-16 sm:w-20 sm:h-20" />
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <p className="mt-8 text-sm sm:text-base text-gray-400 text-center animate-pulse">
                Visualiza mentalmente la rotación de la forma
            </p>
        </div>
    );
};
