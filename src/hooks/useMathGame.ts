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
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const generateProblem = useCallback((op?: Operation) => {
        const currentOp = op || gameState?.operation || 'sum';
        const difficulty = Math.floor(score / 50); // Increase difficulty every 5 questions correctly answered
        let question = '';
        let ans = 0;

        const generateComponent = (type: Operation) => {
            let n1 = 0, n2 = 0, localAns = 0, q = '';
            switch (type) {
                case 'sum':
                    n1 = Math.floor(Math.random() * 50) + 1;
                    n2 = Math.floor(Math.random() * 50) + 1;
                    localAns = n1 + n2;
                    q = `${n1} + ${n2}`;
                    break;
                case 'sub':
                    n1 = Math.floor(Math.random() * 100) + 20;
                    n2 = Math.floor(Math.random() * (n1 - 5)) + 1;
                    localAns = n1 - n2;
                    q = `${n1} - ${n2}`;
                    break;
                case 'mul':
                    n1 = Math.floor(Math.random() * 10) + 2;
                    n2 = Math.floor(Math.random() * 10) + 2;
                    localAns = n1 * n2;
                    q = `${n1} \\times ${n2}`;
                    break;
                case 'div':
                    localAns = Math.floor(Math.random() * 10) + 2;
                    n2 = Math.floor(Math.random() * 10) + 2;
                    n1 = localAns * n2;
                    q = `${n1} \\div ${n2}`;
                    break;
                case 'pow':
                    n1 = Math.floor(Math.random() * 8) + 2;
                    n2 = Math.floor(Math.random() * 2) + 2;
                    localAns = Math.pow(n1, n2);
                    q = `${n1}^{${n2}}`;
                    break;
                case 'sqrt':
                    localAns = Math.floor(Math.random() * 12) + 2;
                    n1 = localAns * localAns;
                    q = `\\sqrt{${n1}}`;
                    break;
            }
            return { q, ans: localAns };
        };

        if (currentOp === 'mixed') {
            // Start with at least 3 numbers from the beginning for Mixed mode
            const numElements = Math.min(3 + Math.floor(difficulty / 1), 6);

            // Available operations for mixing
            const ops: string[] = ['+', '-', '\\times', '\\div'];

            // Initialize with a first number
            let initialVal = Math.floor(Math.random() * 15) + 5;
            let currentAns = initialVal;
            let currentQ = `${initialVal}`;

            for (let i = 1; i < numElements; i++) {
                // Ensure we mix operators: if first op was +/- , try to make second op * / or vice versa intermittently
                let nextOp = ops[Math.floor(Math.random() * ops.length)];
                let nextVal = 0;

                if (nextOp === '+') {
                    nextVal = Math.floor(Math.random() * 20) + 2;
                    currentAns += nextVal;
                    currentQ += ` + ${nextVal}`;
                } else if (nextOp === '-') {
                    nextVal = Math.floor(Math.random() * (currentAns > 5 ? currentAns - 2 : 10)) + 1;
                    currentAns -= nextVal;
                    currentQ += ` - ${nextVal}`;
                } else if (nextOp === '\\times') {
                    nextVal = Math.floor(Math.random() * 5) + 2;
                    // Always wrap previous expression in parentheses for mental clarity when multiplying
                    if (currentQ.includes('+') || currentQ.includes('-') || currentQ.includes('\\div')) {
                        currentQ = `(${currentQ}) \\times ${nextVal}`;
                    } else {
                        currentQ = `${currentQ} \\times ${nextVal}`;
                    }
                    currentAns *= nextVal;
                } else if (nextOp === '\\div') {
                    // To ensure clean division: we make currentAns the multiple
                    nextVal = Math.floor(Math.random() * 5) + 2;
                    // Adjust currentAns and currentQ to make it divisible
                    const multiplier = nextVal;
                    if (currentQ.includes('+') || currentQ.includes('-') || currentQ.includes('\\times')) {
                        currentQ = `(${currentQ} \\times ${multiplier}) \\div ${nextVal}`;
                    } else {
                        currentQ = `(${currentQ} \\times ${multiplier}) \\div ${nextVal}`;
                    }
                    // The result of currentAns * multiplier / nextVal is just currentAns
                    // but to make it look like a real division problem in the string:
                    // we actually need to change the values. Let's simplify:
                    // We'll just ensure the current total is divisible.
                    if (currentAns % nextVal !== 0) {
                        const remainder = currentAns % nextVal;
                        currentAns += (nextVal - remainder);
                        // Update currentQ to reflect the adjustment (adding to the last term)
                        currentQ = currentQ.replace(/(\d+)$/, (match) => (parseInt(match) + (nextVal - remainder)).toString());
                    }
                    currentAns /= nextVal;
                    currentQ = `(${currentQ}) \\div ${nextVal}`;
                }
            }
            ans = currentAns;
            question = currentQ;
        } else if (currentOp === 'dec') {
            const decPattern = Math.random();
            if (decPattern < 0.5) {
                // Decimal addition
                const n1 = Math.floor(Math.random() * 50) + 1;
                const d1 = (Math.floor(Math.random() * 9) + 1) / 10;
                const n2 = Math.floor(Math.random() * 50) + 1;
                const d2 = (Math.floor(Math.random() * 9) + 1) / 10;
                const val1 = n1 + d1;
                const val2 = n2 + d2;
                ans = Math.round((val1 + val2) * 10) / 10;
                question = `${val1.toFixed(1)} + ${val2.toFixed(1)}`;
            } else {
                // Decimal subtraction
                const n1 = Math.floor(Math.random() * 50) + 20;
                const d1 = (Math.floor(Math.random() * 9) + 1) / 10;
                const n2 = Math.floor(Math.random() * 15) + 1;
                const d2 = (Math.floor(Math.random() * 9) + 1) / 10;
                const val1 = n1 + d1;
                const val2 = n2 + d2;
                ans = Math.round((val1 - val2) * 10) / 10;
                question = `${val1.toFixed(1)} - ${val2.toFixed(1)}`;
            }
        } else {
            const opToExecute = currentOp;
            const numCount = (opToExecute === 'sum' || opToExecute === 'sub') ? (Math.random() > 0.5 ? 3 : 2) : 2;

            if (numCount === 3 && (opToExecute === 'sum' || opToExecute === 'sub')) {
                const n1 = Math.floor(Math.random() * 50) + 10;
                const n2 = Math.floor(Math.random() * 40) + 5;
                const n3 = Math.floor(Math.random() * 30) + 1;

                if (opToExecute === 'sum') {
                    ans = n1 + n2 + n3;
                    question = `${n1} + ${n2} + ${n3}`;
                } else {
                    ans = n1 + 50 - n2 - n3;
                    question = `${n1 + 50} - ${n2} - ${n3}`;
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
    }, [score, gameState?.operation]);

    const startGame = (op: Operation) => {
        setScore(0);
        setTimeLeft(60);
        setIsActive(true);
        setIsGameOver(false);
        generateProblem(op);
    };

    const checkAnswer = (userAnswer: number | string) => {
        if (!gameState) return false;

        const parsedUserAnswer = typeof userAnswer === 'string' ? parseFloat(userAnswer) : userAnswer;
        // Use a small epsilon or round to handle floating point precision issues
        const isCorrect = Math.abs(parsedUserAnswer - gameState.correctAnswer) < 0.01;

        if (isCorrect) {
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
