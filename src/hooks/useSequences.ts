import { useState, useCallback } from 'react';
import { useGameTimer } from './useGameTimer';

interface SequenceState {
    numbers: number[];
    hiddenIndex: number;
    answer: number;
    options: number[];
}

interface Difficulty {
    seqLength: number;
    maxValue: number;
    ops: string[];
}

const DIFFICULTY: Difficulty[] = [
    { seqLength: 4, maxValue: 20, ops: ['add'] },
    { seqLength: 4, maxValue: 50, ops: ['add', 'sub'] },
    { seqLength: 5, maxValue: 100, ops: ['add', 'sub', 'mul'] },
    { seqLength: 5, maxValue: 200, ops: ['add', 'sub', 'mul'] },
    { seqLength: 6, maxValue: 500, ops: ['add', 'sub', 'mul', 'div'] },
    { seqLength: 6, maxValue: 1000, ops: ['add', 'sub', 'mul', 'div', 'mixed'] },
];

const generateSequence = (diff: Difficulty): SequenceState => {
    const { seqLength, maxValue, ops } = diff;
    const op = ops[Math.floor(Math.random() * ops.length)];
    let numbers: number[] = [];

    switch (op) {
        case 'add': {
            const start = Math.floor(Math.random() * 10) + 1;
            const step = Math.floor(Math.random() * 9) + 2;
            numbers = Array.from({ length: seqLength }, (_, i) => start + step * i);
            break;
        }
        case 'sub': {
            const start = Math.floor(Math.random() * maxValue * 0.3) + maxValue * 0.3;
            const step = Math.floor(Math.random() * 9) + 2;
            numbers = Array.from({ length: seqLength }, (_, i) => start - step * i);
            break;
        }
        case 'mul': {
            const start = Math.floor(Math.random() * 3) + 2;
            const ratio = Math.floor(Math.random() * 3) + 2;
            numbers = Array.from({ length: seqLength }, (_, i) => start * Math.pow(ratio, i));
            break;
        }
        case 'div': {
            const ratio = Math.floor(Math.random() * 3) + 2;
            const end = Math.floor(Math.random() * 5) + 1;
            numbers = Array.from({ length: seqLength }, (_, i) => end * Math.pow(ratio, seqLength - 1 - i));
            break;
        }
        case 'mixed':
        default: {
            const patterns = [
                () => {
                    const a = Math.floor(Math.random() * 5) + 1;
                    const b = Math.floor(Math.random() * 10) + 1;
                    return Array.from({ length: seqLength }, (_, i) => a * (i + 1) + b);
                },
                () => {
                    const a = Math.floor(Math.random() * 3) + 1;
                    const b = Math.floor(Math.random() * 5) + 1;
                    return Array.from({ length: seqLength }, (_, i) => a * (i + 1) * (i + 1) + b);
                },
                () => {
                    const start = Math.floor(Math.random() * 10) + 1;
                    return Array.from({ length: seqLength }, (_, i) => start + Math.floor(i * (i + 1) / 2));
                },
            ];
            numbers = patterns[Math.floor(Math.random() * patterns.length)]();
            break;
        }
    }

    const hiddenIndex = Math.floor(Math.random() * seqLength);
    const answer = numbers[hiddenIndex];

    const opts = new Set<number>([answer]);
    while (opts.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const wrong = answer + (offset === 0 ? 1 : offset);
        if (wrong !== answer && wrong >= 0) opts.add(wrong);
    }

    return {
        numbers,
        hiddenIndex,
        answer,
        options: [...opts].sort(() => Math.random() - 0.5),
    };
};

export const useSequences = () => {
    const [gameState, setGameState] = useState<SequenceState | null>(null);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const timer = useGameTimer();

    const nextRound = useCallback(() => {
        const diff = DIFFICULTY[Math.min(difficulty, DIFFICULTY.length - 1)];
        setGameState(generateSequence(diff));
    }, [difficulty]);

    const startGame = () => {
        setScore(0);
        setDifficulty(0);
        setStreak(0);
        timer.start();
        const diff = DIFFICULTY[0];
        setGameState(generateSequence(diff));
    };

    const submitAnswer = (value: number) => {
        if (!gameState) return false;

        const isCorrect = value === gameState.answer;

        if (isCorrect) {
            setScore(s => s + 10 * (difficulty + 1));
            setStreak(prev => {
                const next = prev + 1;
                if (next >= 3) {
                    setDifficulty(d => Math.min(d + 1, DIFFICULTY.length - 1));
                    return 0;
                }
                return next;
            });
        } else {
            setStreak(0);
        }

        nextRound();
        return isCorrect;
    };

    return {
        gameState,
        score,
        difficulty,
        streak,
        isGameOver: timer.isGameOver,
        timeLeft: timer.timeLeft,
        startGame,
        submitAnswer,
    };
};
