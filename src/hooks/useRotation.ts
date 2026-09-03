import { useState, useCallback } from 'react';
import { useGameTimer } from './useGameTimer';

interface ShapeDef {
    name: string;
    grid: number[][];
}

const SHAPES: ShapeDef[] = [
    {
        name: 'L',
        grid: [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
    },
    {
        name: 'T',
        grid: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
        ],
    },
    {
        name: 'S',
        grid: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
    },
    {
        name: 'Z',
        grid: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
    },
    {
        name: 'J',
        grid: [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
    },
    {
        name: 'Block',
        grid: [
            [1, 1],
            [1, 1],
        ],
    },
];

interface MentalRotation {
    grid: number[][];
    angle: number;
    isCorrect: boolean;
}

interface Difficulty {
    numOptions: number;
    timeLimit: number;
    angles: number[];
}

const DIFFICULTY: Difficulty[] = [
    { numOptions: 3, timeLimit: 60, angles: [90, 180, 270] },
    { numOptions: 4, timeLimit: 55, angles: [45, 90, 135, 180, 225, 270, 315] },
    { numOptions: 4, timeLimit: 50, angles: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] },
    { numOptions: 5, timeLimit: 45, angles: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] },
    { numOptions: 5, timeLimit: 40, angles: [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345] },
    { numOptions: 6, timeLimit: 35, angles: [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345] },
];

function rotateGrid(grid: number[][], angleDeg: number): number[][] {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.round(Math.cos(rad));
    const sin = Math.round(Math.sin(rad));
    const rows = grid.length;
    const cols = grid[0].length;
    const size = Math.max(rows, cols);
    const padded: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            padded[r + Math.floor((size - rows) / 2)][c + Math.floor((size - cols) / 2)] = grid[r][c];
        }
    }
    const result: number[][] = Array.from({ length: size }, () => Array(size).fill(0));
    const center = (size - 1) / 2;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const dr = r - center;
            const dc = c - center;
            const nr = Math.round(center + dr * cos - dc * sin);
            const nc = Math.round(center + dr * sin + dc * cos);
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                result[nr][nc] = padded[r][c];
            }
        }
    }
    return result;
}

export const useRotation = () => {
    const [referenceShape, setReferenceShape] = useState<number[][]>([]);
    const [options, setOptions] = useState<MentalRotation[]>([]);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const timer = useGameTimer();

    const generateRound = useCallback((diff: number) => {
        const { numOptions, angles } = DIFFICULTY[Math.min(diff, DIFFICULTY.length - 1)];
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const correctAngle = angles[Math.floor(Math.random() * angles.length)];
        const rotated = rotateGrid(shape.grid, correctAngle);

        const opts: MentalRotation[] = [];
        const usedAngles = new Set([correctAngle]);
        for (let i = 0; i < numOptions - 1; i++) {
            let angle: number;
            do {
                angle = angles[Math.floor(Math.random() * angles.length)];
            } while (usedAngles.has(angle));
            usedAngles.add(angle);
            opts.push({ grid: rotateGrid(shape.grid, angle), angle, isCorrect: false });
        }

        const correctPos = Math.floor(Math.random() * numOptions);
        opts.splice(correctPos, 0, { grid: rotated, angle: correctAngle, isCorrect: true });

        setReferenceShape(shape.grid);
        setOptions(opts);
        setCorrectIndex(correctPos);
        setSelectedIndex(null);
    }, []);

    const startGame = () => {
        setScore(0);
        setDifficulty(0);
        setStreak(0);
        setSelectedIndex(null);
        timer.start();
        generateRound(0);
    };

    const submitAnswer = (index: number) => {
        setSelectedIndex(index);
        const isCorrect = options[index]?.isCorrect ?? false;

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

        setTimeout(() => {
            generateRound(isCorrect ? difficulty : difficulty);
        }, 600);

        return isCorrect;
    };

    return {
        referenceShape,
        options,
        correctIndex,
        selectedIndex,
        score,
        difficulty,
        streak,
        isGameOver: timer.isGameOver,
        timeLeft: timer.timeLeft,
        startGame,
        submitAnswer,
    };
};
