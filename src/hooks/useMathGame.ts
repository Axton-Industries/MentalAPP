import { useState, useEffect, useCallback } from 'react';

export type Operation = 'sum' | 'sub' | 'mul' | 'div' | 'pow' | 'sqrt' | 'mixed' | 'dec';

interface GameState {
    question: string;
    correctAnswer: number;
    operation: Operation;
}

export const useMathGame = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [difficulty, setDifficulty] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const generateProblem = useCallback((op?: Operation) => {
        const currentOp = op || gameState?.operation || 'sum';
        let question = '';
        let ans = 0;

        const generateComponent = (type: Operation) => {
            let n1 = 0, n2 = 0, localAns = 0, q = '';
            // Scale factor based on difficulty level
            const scale = 1 + (difficulty * 0.5);

            switch (type) {
                case 'sum':
                    n1 = Math.floor(Math.random() * (50 * scale)) + 1;
                    n2 = Math.floor(Math.random() * (50 * scale)) + 1;
                    localAns = n1 + n2;
                    q = `${n1} + ${n2}`;
                    break;
                case 'sub':
                    n1 = Math.floor(Math.random() * (100 * scale)) + 20;
                    n2 = Math.floor(Math.random() * (n1 - 5)) + 1;
                    localAns = n1 - n2;
                    q = `${n1} - ${n2}`;
                    break;
                case 'mul':
                    n1 = Math.floor(Math.random() * (10 + difficulty)) + 2;
                    n2 = Math.floor(Math.random() * (10 + difficulty)) + 2;
                    localAns = n1 * n2;
                    q = `${n1} \\times ${n2}`;
                    break;
                case 'div':
                    localAns = Math.floor(Math.random() * (10 + difficulty)) + 2;
                    n2 = Math.floor(Math.random() * (10 + difficulty)) + 2;
                    n1 = localAns * n2;
                    q = `${n1} \\div ${n2}`;
                    break;
                case 'pow':
                    n1 = Math.floor(Math.random() * (8 + Math.floor(difficulty / 2))) + 2;
                    n2 = Math.floor(Math.random() * 2) + 2;
                    localAns = Math.pow(n1, n2);
                    q = `${n1}^{${n2}}`;
                    break;
                case 'sqrt':
                    localAns = Math.floor(Math.random() * (12 + difficulty)) + 2;
                    n1 = localAns * localAns;
                    q = `\\sqrt{${n1}}`;
                    break;
            }
            return { q, ans: localAns };
        };

        if (currentOp === 'mixed') {
            const numElements = Math.min(3 + Math.floor(difficulty / 2), 7);
            const ops: string[] = ['+', '-', '\\times', '\\div'];
            let initialVal = Math.floor(Math.random() * (15 + difficulty * 5)) + 5;
            let currentAns = initialVal;
            let currentQ = `${initialVal}`;

            for (let i = 1; i < numElements; i++) {
                let nextOp = ops[Math.floor(Math.random() * ops.length)];
                let nextVal = 0;

                if (nextOp === '+') {
                    nextVal = Math.floor(Math.random() * (20 + difficulty * 10)) + 2;
                    currentAns += nextVal;
                    currentQ += ` + ${nextVal}`;
                } else if (nextOp === '-') {
                    nextVal = Math.floor(Math.random() * (currentAns > 5 ? currentAns - 2 : 10)) + 1;
                    currentAns -= nextVal;
                    currentQ += ` - ${nextVal}`;
                } else if (nextOp === '\\times') {
                    nextVal = Math.floor(Math.random() * 4) + 2;
                    if (currentQ.includes('+') || currentQ.includes('-') || currentQ.includes('\\div')) {
                        currentQ = `(${currentQ}) \\times ${nextVal}`;
                    } else {
                        currentQ = `${currentQ} \\times ${nextVal}`;
                    }
                    currentAns *= nextVal;
                } else if (nextOp === '\\div') {
                    nextVal = Math.floor(Math.random() * 4) + 2; // 2 to 5
                    // Allow simple decimals: remainder can be 0 or 0.5 * nextVal (if nextVal is even)
                    const canBeHalf = nextVal % 2 === 0;
                    const targetRemainder = (canBeHalf && Math.random() > 0.5) ? nextVal / 2 : 0;

                    const currentRem = currentAns % nextVal;
                    if (currentRem !== targetRemainder) {
                        const adjustment = targetRemainder - currentRem;
                        currentAns += adjustment;
                        // Fix last number in string correctly even with parentheses
                        const parts = currentQ.split(/(\d+)(?!.*\d)/);
                        if (parts.length >= 3) {
                            const lastNum = parseInt(parts[1]);
                            parts[1] = (lastNum + adjustment).toString();
                            currentQ = parts.join('');
                        }
                    }
                    currentAns /= nextVal;
                    currentQ = `(${currentQ}) \\div ${nextVal}`;
                }
            }
            ans = currentAns;
            question = currentQ;
        } else if (currentOp === 'dec') {
            const scale = 1 + (difficulty * 0.3);
            if (Math.random() < 0.5) {
                const n1 = Math.floor(Math.random() * (50 * scale)) + 1;
                const d1 = (Math.floor(Math.random() * 9) + 1) / 10;
                const n2 = Math.floor(Math.random() * (50 * scale)) + 1;
                const d2 = (Math.floor(Math.random() * 9) + 1) / 10;
                ans = Math.round((n1 + d1 + n2 + d2) * 10) / 10;
                question = `${(n1 + d1).toFixed(1)} + ${(n2 + d2).toFixed(1)}`;
            } else {
                const n1 = Math.floor(Math.random() * (50 * scale)) + 20;
                const d1 = (Math.floor(Math.random() * 9) + 1) / 10;
                const n2 = Math.floor(Math.random() * (15 * scale)) + 1;
                const d2 = (Math.floor(Math.random() * 9) + 1) / 10;
                ans = Math.round((n1 + d1 - (n2 + d2)) * 10) / 10;
                question = `${(n1 + d1).toFixed(1)} - ${(n2 + d2).toFixed(1)}`;
            }
        } else {
            const opToExecute = currentOp;
            const numCount = (opToExecute === 'sum' || opToExecute === 'sub') ? (Math.random() > 0.5 && difficulty > 0 ? 3 : 2) : 2;

            if (numCount === 3 && (opToExecute === 'sum' || opToExecute === 'sub')) {
                const scale = 1 + (difficulty * 0.2);
                const n1 = Math.floor(Math.random() * (50 * scale)) + 10;
                const n2 = Math.floor(Math.random() * (40 * scale)) + 5;
                const n3 = Math.floor(Math.random() * (30 * scale)) + 1;

                if (opToExecute === 'sum') {
                    ans = n1 + n2 + n3;
                    question = `${n1} + ${n2} + ${n3}`;
                } else {
                    const base = n1 + n2 + n3 + 10;
                    ans = base - n1 - n2;
                    question = `${base} - ${n1} - ${n2}`;
                }
            } else if (numCount === 3 && opToExecute === 'mul') {
                const n1 = Math.floor(Math.random() * 5) + 2;
                const n2 = Math.floor(Math.random() * 4) + 2;
                const n3 = Math.floor(Math.random() * 3) + 2;
                ans = n1 * n2 * n3;
                question = `${n1} \\times ${n2} \\times ${n3}`;
            } else {
                const result = generateComponent(opToExecute);
                question = result.q;
                ans = result.ans;
            }
        }

        setGameState({
            question,
            correctAnswer: ans,
            operation: currentOp
        });
    }, [difficulty, gameState?.operation]);

    const startGame = (op: Operation) => {
        setScore(0);
        setTimeLeft(60);
        setDifficulty(0);
        setStreak(0);
        setIsActive(true);
        setIsGameOver(false);
        generateProblem(op);
    };

    const checkAnswer = (userAnswer: number | string) => {
        if (!gameState) return false;

        const parsedUserAnswer = typeof userAnswer === 'string' ? parseFloat(userAnswer) : userAnswer;
        const isCorrect = Math.abs(parsedUserAnswer - gameState.correctAnswer) < 0.01;

        if (isCorrect) {
            setScore(s => s + 10);

            // Streak and Difficulty logic
            setStreak(prev => {
                const next = prev + 1;
                if (next >= 5) {
                    setDifficulty(d => d + 1);
                    return 0; // Reset streak after leveling up
                }
                return next;
            });

            generateProblem();
            return true;
        } else {
            setStreak(0); // Reset streak on mistake
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
        gameState,
        score,
        timeLeft,
        difficulty,
        streak,
        isActive,
        isGameOver,
        startGame,
        checkAnswer,
    };
};
