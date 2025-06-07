import React from "react";
import { RiSkipForwardFill } from "react-icons/ri";
import { RiSkipBackFill } from "react-icons/ri";
import { RiPlayLargeFill } from "react-icons/ri";
import { RiPauseLargeFill } from "react-icons/ri";

interface TimerControlsProps {
    onStart: () => void;
    onPause: () => void;
    onSkipBack: () => void;
    onSkipForward: () => void;
    isRunning?: boolean;
}

const TimerControls: React.FC<TimerControlsProps> = ({
    onStart,
    onPause,
    onSkipBack,
    onSkipForward,
    isRunning = false,
}) => {
    return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={onSkipBack} aria-label="Skip Back">
                <RiSkipBackFill />
            </button>
            {isRunning ? (
                <button onClick={onPause} aria-label="Pause">
                    <RiPauseLargeFill />
                </button>
            ) : (
                <button onClick={onStart} aria-label="Start">
                    <RiPlayLargeFill />
                </button>
            )}
            <button onClick={onSkipForward} aria-label="Skip Forward">
                <RiSkipForwardFill />
            </button>
        </div>
    );
};

export default TimerControls;