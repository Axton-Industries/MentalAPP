import { useState, useCallback } from 'react';
import { useGameTimer } from './useGameTimer';

const COLORS = [
    { name: 'Rojo', hex: '#ef4444' },
    { name: 'Azul', hex: '#3b82f6' },
    { name: 'Verde', hex: '#22c55e' },
    { name: 'Amarillo', hex: '#eab308' },
    { name: 'Morado', hex: '#a855f7' },
    { name: 'Naranja', hex: '#f97316' },
    { name: 'Rosa', hex: '#ec4899' },
    { name: 'Cian', hex: '#06b6d4' },
];

interface StroopState {
    word: string;
    color: { name: string; hex: string };
    choices: { name: string; hex: string }[];
}

interface Difficulty {
    numColors: number;
    timeLimit: number;
}

const DIFFICULTY: Difficulty[] = [
    { numColors: 3, timeLimit: 60 },
    { numColors: 4, timeLimit: 60 },
    { numColors: 5, timeLimit: 55 },
    { numColors: 6, timeLimit: 50 },
    { numColors: 7, timeLimit: 45 },
    { numColors: 8, timeLimit: 40 },
];

export const useStroop = () => {
    const [gameState, setGameState] = useState<StroopState | null>(null);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const timer = useGameTimer();

    const generateRound = useCallback((diff: number) => {
        const { numColors } = DIFFICULTY[Math.min(diff, DIFFICULTY.length - 1)];
        const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
        const available = shuffled.slice(0, numColors);
        const wordColor = available[Math.floor(Math.random() * available.length)];
        let displayColor = available[Math.floor(Math.random() * available.length)];
        while (displayColor.name === wordColor.name) {
            displayColor = available[Math.floor(Math.random() * available.length)];
        }
        const choices = [...available].sort(() => Math.random() - 0.5);
        setGameState({ word: wordColor.name, color: displayColor, choices });
    }, []);

    const startGame = () => {
        setScore(0);
        setDifficulty(0);
        setStreak(0);
        setTotalAnswered(0);
        timer.start();
        generateRound(0);
    };

    const submitAnswer = (colorName: string) => {
        if (!gameState) return false;

        const isCorrect = colorName === gameState.color.name;
        setTotalAnswered(t => t + 1);

        if (isCorrect) {
            setScore(s => s + 10 * (difficulty + 1));
            setStreak(prev => {
                const next = prev + 1;
                if (next >= 5) {
                    setDifficulty(d => Math.min(d + 1, DIFFICULTY.length - 1));
                    return 0;
                }
                return next;
            });
        } else {
            setStreak(0);
        }

        generateRound(difficulty);
        return isCorrect;
    };

    return {
        gameState,
        score,
        difficulty,
        streak,
        isGameOver: timer.isGameOver,
        totalAnswered,
        timeLeft: timer.timeLeft,
        startGame,
        submitAnswer,
    };
};
