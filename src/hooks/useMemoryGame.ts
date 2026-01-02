import { useState, useEffect, useCallback } from 'react';

export type MemoryMode = 'alpha' | 'pattern';

interface GameState {
    target: string | number[];
    currentIndex: number;
    status: 'showing' | 'input' | 'result';
}

export const useMemoryGame = () => {
    const [mode, setMode] = useState<MemoryMode>('alpha');
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const generateSequence = useCallback((currentMode: MemoryMode, currentDifficulty: number) => {
        if (currentMode === 'alpha') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const length = 4 + Math.floor(currentDifficulty / 2);
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setGameState({
                target: result,
                currentIndex: 0,
                status: 'showing'
            });
        } else {
            const length = 3 + Math.floor(currentDifficulty / 2);
            const sequence: number[] = [];
            const gridSize = 9; // 3x3 grid
            for (let i = 0; i < length; i++) {
                sequence.push(Math.floor(Math.random() * gridSize));
            }
            setGameState({
                target: sequence,
                currentIndex: 0,
                status: 'showing'
            });
        }
    }, []);

    const startGame = (newMode: MemoryMode) => {
        setMode(newMode);
        setScore(0);
        setTimeLeft(60);
        setDifficulty(0);
        setStreak(0);
        setIsActive(true);
        setIsGameOver(false);
        generateSequence(newMode, 0);
    };

    const nextRound = () => {
        generateSequence(mode, difficulty);
    };

    const setStatus = (status: 'showing' | 'input' | 'result') => {
        setGameState(prev => prev ? { ...prev, status } : null);
    };

    const submitAnswer = (answer: string | number[]) => {
        if (!gameState) return false;

        const isCorrect = Array.isArray(gameState.target)
            ? JSON.stringify(answer) === JSON.stringify(gameState.target)
            : answer === gameState.target;

        if (isCorrect) {
            setScore(s => s + 10 * (difficulty + 1));
            setStreak(prev => {
                const next = prev + 1;
                if (next >= 3) {
                    setDifficulty(d => d + 1);
                    return 0;
                }
                return next;
            });
            nextRound();
            return true;
        } else {
            setStreak(0);
            nextRound();
            return false;
        }
    };

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsGameOver(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    return {
        mode,
        gameState,
        score,
        timeLeft,
        difficulty,
        streak,
        isActive,
        isGameOver,
        startGame,
        submitAnswer,
        setStatus,
        nextRound
    };
};
