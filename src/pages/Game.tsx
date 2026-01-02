import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Timer, Star, RotateCcw, Home as HomeIcon, Zap, Trophy } from 'lucide-react';
import { useMathGame, type Operation } from '../hooks/useMathGame';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MathRenderer } from '../components/MathRenderer';

export const Game: React.FC = () => {
    const { operation } = useParams<{ operation: string }>();
    const navigate = useNavigate();
    const { gameState, score, timeLeft, difficulty, streak, isActive, isGameOver, startGame, checkAnswer } = useMathGame();
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (operation) {
            startGame(operation as Operation);
        }
    }, [operation]);

    useEffect(() => {
        if (isActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isActive, gameState]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer || isGameOver) return;

        const isCorrect = checkAnswer(userAnswer);
        setFeedback(isCorrect ? 'correct' : 'wrong');
        setUserAnswer('');

        setTimeout(() => {
            setFeedback(null);
        }, 500);
    };

    const mathString = useMemo(() => {
        return gameState?.question || '';
    }, [gameState]);

    if (isGameOver) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-12">
                    <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star size={48} fill="currentColor" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">¡Tiempo agotado!</h2>
                    <p className="text-xl text-gray-500 mb-8">Has conseguido una puntuación de:</p>
                    <div className="text-7xl font-black text-indigo-600 mb-12">{score}</div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => operation && startGame(operation as Operation)}>
                            <RotateCcw size={20} /> Reintentar
                        </Button>
                        <Button className="flex items-center gap-2" onClick={() => navigate('/cuentas')}>
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
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate('/cuentas')}>
                    <ArrowLeft size={20} /> Volver
                </Button>
                <div className="flex gap-4 flex-wrap justify-center">
                    <Card className="flex items-center gap-2 py-2 px-4 border-indigo-100">
                        <Star size={20} className="text-indigo-600" />
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Nivel</span>
                        <span className="text-xl font-black text-indigo-600">{difficulty + 1}</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4 border-amber-100">
                        <Zap size={20} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Racha</span>
                        <span className="text-xl font-black text-amber-600">{streak}/5</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4">
                        <Timer size={20} className="text-indigo-600" />
                        <span className="text-xl font-bold font-mono">{timeLeft}s</span>
                    </Card>
                    <Card className="flex items-center gap-2 py-2 px-4">
                        <Trophy size={20} className="text-amber-500" />
                        <span className="text-xl font-bold font-mono">{score}</span>
                    </Card>
                </div>
            </div>

            <Card className={`max-w-2xl w-full p-12 transition-all duration-300 ${feedback === 'correct' ? 'ring-4 ring-emerald-500 bg-emerald-50' :
                feedback === 'wrong' ? 'ring-4 ring-red-500 bg-red-50' : ''
                }`}>
                {gameState && (
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <div className="flex items-center justify-center gap-8 text-gray-900 mb-12">
                            <div className={`flex items-center gap-4 transition-all duration-300 ${mathString.length > 25 ? 'text-4xl' :
                                mathString.length > 15 ? 'text-5xl' :
                                    'text-7xl'
                                } font-black`}>
                                <MathRenderer math={mathString} />
                                <span className="text-gray-400">=</span>
                            </div>
                        </div>

                        <div className="w-full max-w-xs">
                            <Input
                                ref={inputRef}
                                type="text"
                                inputMode="decimal"
                                placeholder="?"
                                value={userAnswer}
                                onChange={(e) => {
                                    const val = e.target.value.replace(',', '.');
                                    if (/^-?\d*\.?\d*$/.test(val) || val === '') {
                                        setUserAnswer(val);
                                    }
                                }}
                                autoFocus
                            />
                            <Button type="submit" className="w-full mt-6 py-4 text-xl">
                                Comprobar
                            </Button>
                        </div>
                    </form>
                )}
            </Card>

            <p className="mt-8 text-gray-400 animate-pulse">
                Escribe la respuesta y pulsa Enter
            </p>
        </div>
    );
};
