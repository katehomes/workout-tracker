import React from 'react';

interface TimerDisplayProps {
    seconds: number;
}

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
    return (
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {formatTime(seconds)}
        </div>
    );
};

export default TimerDisplay;