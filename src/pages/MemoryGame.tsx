import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Star, RotateCcw, Home as HomeIcon, Zap, Trophy, Brain } from 'lucide-react';
import { useMemoryGame, type MemoryMode } from '../hooks/useMemoryGame';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const MemoryGame: React.FC = () => {
    const { mode } = useParams<{ mode: string }>();
    const navigate = useNavigate();
    const {
        gameState, score, timeLeft, difficulty, streak, isGameOver,
        startGame, submitAnswer, setStatus
    } = useMemoryGame();

    const [alphaInput, setAlphaInput] = useState('');
    const [patternInput, setPatternInput] = useState<number[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const alphaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mode) {
            startGame(mode as MemoryMode);
        }
    }, [mode]);

    // Handle Alphanumeric Game Flow
    useEffect(() => {
        if (gameState?.status === 'showing' && mode === 'alpha') {
            const timer = setTimeout(() => {
                setStatus('input');
            }, 2000 + (difficulty * 500));
            return () => clearTimeout(timer);
        }
    }, [gameState?.status, mode, difficulty]);

    // Handle Pattern Game Flow (Sequence Playback)
    useEffect(() => {
        if (gameState?.status === 'showing' && mode === 'pattern') {
            const sequence = gameState.target as number[];
            let i = 0;
            const interval = setInterval(() => {
                if (i < sequence.length) {
                    setHighlightedIndex(sequence[i]);
                    setTimeout(() => setHighlightedIndex(null), 400);
                    i++;
                } else {
                    clearInterval(interval);
                    setStatus('input');
                    setPatternInput([]);
                }
            }, 800);
            return () => clearInterval(interval);
        }
    }, [gameState?.status, mode]);

    const handleAlphaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!alphaInput || isGameOver) return;

        const isCorrect = submitAnswer(alphaInput.toUpperCase());
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setAlphaInput('');

        setTimeout(() => setFeedback(null), 500);
    };

    const handlePatternClick = (index: number) => {
        if (gameState?.status !== 'input' || isGameOver) return;

        const newSequence = [...patternInput, index];
        setPatternInput(newSequence);

        setHighlightedIndex(index);
        setTimeout(() => setHighlightedIndex(null), 200);

        const target = gameState.target as number[];

        if (target[newSequence.length - 1] !== index) {
            setFeedback('wrong');
            setTimeout(() => {
                setFeedback(null);
                submitAnswer([]);
            }, 500);
            return;
        }

        if (newSequence.length === target.length) {
            setFeedback('correct');
            setTimeout(() => {
                setFeedback(null);
                submitAnswer(newSequence);
            }, 500);
        }
    };

    if (isGameOver) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-12">
                    <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Brain size={48} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">¡Fin del juego!</h2>
                    <p className="text-xl text-gray-500 mb-8">Puntuación total:</p>
                    <div className="text-7xl font-black text-indigo-600 mb-12">{score}</div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => mode && startGame(mode as MemoryMode)}>
                            <RotateCcw size={20} /> Reintentar
                        </Button>
                        <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/memory')}>
                            <HomeIcon size={20} /> Menú
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[85vh] flex flex-col items-center p-4">
            <div className="w-full max-w-5xl flex items-center justify-between mb-8 flex-wrap gap-4">
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate('/memory')}>
                    <ArrowLeft size={20} /> Volver
                </Button>
                <div className="flex gap-4 flex-wrap justify-center">
                    <Card className="flex items-center gap-2 py-2 px-4 border-purple-100">
                        <Star size={20} className="text-purple-600" />
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Nivel</span>
                        <span className="text-xl font-black text-purple-600">{difficulty + 1}</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4 border-amber-100">
                        <Zap size={20} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Racha</span>
                        <span className="text-xl font-black text-amber-600">{streak}/3</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4 border-purple-100">
                        <Timer size={20} className="text-purple-600" />
                        <span className="text-xl font-bold font-mono">{timeLeft}s</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4">
                        <Trophy size={20} className="text-amber-500" />
                        <span className="text-xl font-bold font-mono">{score}</span>
                    </Card>
                </div>
            </div>

            <Card className={`max-w-2xl w-full p-12 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300 border-purple-100 ${feedback === 'correct' ? 'ring-4 ring-emerald-500 bg-emerald-50' :
                    feedback === 'wrong' ? 'ring-4 ring-red-500 bg-red-50' : ''
                }`}>
                {gameState && (
                    <div className="w-full">
                        {mode === 'alpha' ? (
                            <div className="flex flex-col items-center">
                                {gameState.status === 'showing' ? (
                                    <div className="text-7xl font-black tracking-widest animate-pulse text-purple-600">
                                        {gameState.target}
                                    </div>
                                ) : (
                                    <form onSubmit={handleAlphaSubmit} className="w-full max-w-xs">
                                        <h3 className="text-center text-gray-400 mb-6 uppercase tracking-widest font-bold">¿Qué viste?</h3>
                                        <Input
                                            ref={alphaInputRef}
                                            type="text"
                                            placeholder="..."
                                            value={alphaInput}
                                            onChange={(e) => setAlphaInput(e.target.value)}
                                            autoFocus
                                            className="text-center text-3xl uppercase tracking-widest h-20"
                                        />
                                        <Button type="submit" className="w-full mt-6 py-4 text-xl bg-purple-600 hover:bg-purple-700">
                                            Responder
                                        </Button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <h3 className="text-center text-gray-400 mb-8 uppercase tracking-widest font-bold">
                                    {gameState.status === 'showing' ? 'Observa el patrón' : 'Repite el patrón'}
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[...Array(9)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePatternClick(i)}
                                            disabled={gameState.status !== 'input'}
                                            className={`w-24 h-24 rounded-2xl transition-all duration-200 ${highlightedIndex === i
                                                ? 'bg-purple-500 scale-95 shadow-inner'
                                                : 'bg-white border-2 border-purple-100 hover:border-purple-300 shadow-sm active:scale-90'
                                                } ${gameState.status === 'showing' ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <p className="mt-8 text-gray-400 text-center">
                {mode === 'alpha'
                    ? (gameState?.status === 'showing' ? 'Memoriza los caracteres' : 'Escribe la secuencia y pulsa Enter')
                    : (gameState?.status === 'showing' ? 'Espera a que termine de iluminarse' : 'Pulsa los cubos en el mismo orden')
                }
            </p>
        </div>
    );
};
