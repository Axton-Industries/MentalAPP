import { useState, useEffect, useCallback } from 'react';

export type Operation = 'sum' | 'sub' | 'mul' | 'div' | 'pow' | 'sqrt';

interface GameState {
    num1: number;
    num2: number;
    operation: Operation;
    options: number[];
    correctAnswer: number;
}

export const useMathGame = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const generateProblem = useCallback((op?: Operation) => {
        const currentOp = op || gameState?.operation || 'sum';
        let n1 = 0, n2 = 0, ans = 0;

        switch (currentOp) {
            case 'sum':
                n1 = Math.floor(Math.random() * 200) + 1;
                n2 = Math.floor(Math.random() * 200) + 1;
                ans = n1 + n2;
                break;
            case 'sub':
                n1 = Math.floor(Math.random() * 300) + 50;
                n2 = Math.floor(Math.random() * n1) + 1;
                ans = n1 - n2;
                break;
            case 'mul':
                n1 = Math.floor(Math.random() * 20) + 2;
                n2 = Math.floor(Math.random() * 15) + 2;
                ans = n1 * n2;
                break;
            case 'div':
                ans = Math.floor(Math.random() * 20) + 2;
                n2 = Math.floor(Math.random() * 15) + 2;
                n1 = ans * n2;
                break;
            case 'pow':
                n1 = Math.floor(Math.random() * 12) + 2;
                n2 = Math.floor(Math.random() * 2) + 2;
                ans = Math.pow(n1, n2);
                break;
            case 'sqrt':
                ans = Math.floor(Math.random() * 20) + 2;
                n1 = ans * ans;
                n2 = 0;
                break;
        }

        setGameState({
            num1: n1,
            num2: n2,
            operation: currentOp,
            correctAnswer: ans,
            options: [] // Optional: for multiple choice if needed later
        });
    }, [gameState?.operation]);

    const startGame = (op: Operation) => {
        setScore(0);
        setTimeLeft(60);
        setIsActive(true);
        setIsGameOver(false);
        generateProblem(op);
    };

    const checkAnswer = (userAnswer: number) => {
        if (!gameState) return false;

        if (userAnswer === gameState.correctAnswer) {
            setScore(s => s + 10);
            generateProblem();
            return true;
        }
        return false;
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
        gameState,
        score,
        timeLeft,
        isActive,
        isGameOver,
        startGame,
        checkAnswer,
    };
};
