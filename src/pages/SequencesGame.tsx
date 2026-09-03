import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Star, RotateCcw, Home as HomeIcon, Zap, Trophy } from 'lucide-react';
import { useSequences } from '../hooks/useSequences';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SequencesGame = () => {
    const navigate = useNavigate();
    const {
        gameState, score, difficulty, streak, isGameOver,
        timeLeft, startGame, submitAnswer,
    } = useSequences();

    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    useEffect(() => {
        startGame();
    }, []);

    const handleAnswer = (value: number) => {
        if (isGameOver || !gameState) return;

        const isCorrect = submitAnswer(value);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setTimeout(() => setFeedback(null), 500);
    };

    if (isGameOver) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-6 sm:p-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl sm:text-4xl">🧩</span>
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

    if (!gameState) return null;

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
                    <p className="text-sm sm:text-base text-gray-400 uppercase tracking-widest font-bold mb-8 sm:mb-12">
                        ¿Qué número completa la secuencia?
                    </p>

                    <div className="flex items-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap justify-center">
                        {gameState.numbers.map((num, i) => (
                            <div key={i} className="flex items-center gap-2 sm:gap-4">
                                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl font-black ${
                                    i === gameState.hiddenIndex
                                        ? 'bg-amber-100 text-amber-600 border-2 border-dashed border-amber-400'
                                        : 'bg-gray-50 text-gray-800 border-2 border-gray-100'
                                }`}>
                                    {i === gameState.hiddenIndex ? '?' : num}
                                </div>
                                {i < gameState.numbers.length - 1 && (
                                    <span className="text-gray-300 text-lg sm:text-2xl">→</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
                        {gameState.options.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(option)}
                                className="py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-lg sm:text-2xl transition-all duration-200 active:scale-95 border-2 border-gray-200 bg-white hover:border-amber-300 hover:shadow-md text-gray-800"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <p className="mt-8 text-sm sm:text-base text-gray-400 text-center animate-pulse">
                Encuentra el patrón y completa la serie
            </p>
        </div>
    );
};
