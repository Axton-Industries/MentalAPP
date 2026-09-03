import { useState, useEffect } from 'react';

export const useGameTimer = (initialTime = 60) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const start = () => {
        setTimeLeft(initialTime);
        setIsActive(true);
        setIsGameOver(false);
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

    return { timeLeft, isActive, isGameOver, start };
};
