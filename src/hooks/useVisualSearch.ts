import { useState, useCallback } from 'react';
import { useGameTimer } from './useGameTimer';

const TARGET_EMOJIS = ['🎯', '🔍', '💎', '⭐', '🔮', '🎪'];
const DISTRACTOR_EMOJIS = ['🔵', '🟣', '⚫', '🟤', '🔶', '🔷', '🟢', '🔴'];

interface GridCell {
    id: number;
    emoji: string;
    isTarget: boolean;
    found: boolean;
}

interface Difficulty {
    gridSize: number;
    numTargets: number;
    numDistractors: number;
    timeLimit: number;
}

const DIFFICULTY: Difficulty[] = [
    { gridSize: 12, numTargets: 2, numDistractors: 10, timeLimit: 30 },
    { gridSize: 16, numTargets: 3, numDistractors: 13, timeLimit: 30 },
    { gridSize: 20, numTargets: 3, numDistractors: 17, timeLimit: 25 },
    { gridSize: 25, numTargets: 4, numDistractors: 21, timeLimit: 25 },
    { gridSize: 30, numTargets: 4, numDistractors: 26, timeLimit: 20 },
    { gridSize: 36, numTargets: 5, numDistractors: 31, timeLimit: 20 },
];

export const useVisualSearch = () => {
    const [grid, setGrid] = useState<GridCell[]>([]);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const [foundCount, setFoundCount] = useState(0);
    const timer = useGameTimer();

    const generateGrid = useCallback((diff: number) => {
        const { gridSize, numTargets, numDistractors } = DIFFICULTY[Math.min(diff, DIFFICULTY.length - 1)];
        const targetEmoji = TARGET_EMOJIS[Math.floor(Math.random() * TARGET_EMOJIS.length)];
        const distractorPool = [...DISTRACTOR_EMOJIS].sort(() => Math.random() - 0.5).slice(0, Math.min(3, DISTRACTOR_EMOJIS.length));

        const cells: GridCell[] = [];
        for (let i = 0; i < numTargets; i++) {
            cells.push({ id: i, emoji: targetEmoji, isTarget: true, found: false });
        }
        for (let i = numTargets; i < numTargets + numDistractors; i++) {
            cells.push({
                id: i,
                emoji: distractorPool[Math.floor(Math.random() * distractorPool.length)],
                isTarget: false,
                found: false,
            });
        }
        while (cells.length < gridSize) {
            cells.push({
                id: cells.length,
                emoji: distractorPool[Math.floor(Math.random() * distractorPool.length)],
                isTarget: false,
                found: false,
            });
        }

        setGrid(cells.sort(() => Math.random() - 0.5));
        setFoundCount(0);
    }, []);

    const startGame = () => {
        setScore(0);
        setDifficulty(0);
        setStreak(0);
        timer.start();
        generateGrid(0);
    };

    const clickCell = (id: number) => {
        const cell = grid.find(c => c.id === id);
        if (!cell || cell.found) return;

        if (cell.isTarget) {
            const newGrid = grid.map(c => c.id === id ? { ...c, found: true } : c);
            setGrid(newGrid);
            const newFound = foundCount + 1;
            setFoundCount(newFound);

            const { numTargets } = DIFFICULTY[Math.min(difficulty, DIFFICULTY.length - 1)];
            if (newFound === numTargets) {
                setScore(s => s + 100 * (difficulty + 1));
                setStreak(prev => {
                    const next = prev + 1;
                    if (next >= 3) {
                        setDifficulty(d => Math.min(d + 1, DIFFICULTY.length - 1));
                        return 0;
                    }
                    return next;
                });
                generateGrid(difficulty + 1);
            }
        } else {
            setScore(s => Math.max(0, s - 5));
            setStreak(0);
        }
    };

    return {
        grid,
        score,
        difficulty,
        streak,
        foundCount,
        isGameOver: timer.isGameOver,
        timeLeft: timer.timeLeft,
        startGame,
        clickCell,
        getTargetEmoji: () => grid.find(c => c.isTarget)?.emoji ?? '🎯',
        getTargetsLeft: () => {
            const { numTargets } = DIFFICULTY[Math.min(difficulty, DIFFICULTY.length - 1)];
            return numTargets - foundCount;
        },
    };
};
