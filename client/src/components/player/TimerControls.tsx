import React from "react";
import { RiSkipForwardFill } from "react-icons/ri";
import { RiSkipBackFill } from "react-icons/ri";
import { RiPlayCircleLine } from "react-icons/ri";
import { RiPauseCircleFill } from "react-icons/ri";

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
                    <RiPauseCircleFill size={28}/>
                </button>
            ) : (
                <button onClick={onStart} aria-label="Start">
                    <RiPlayCircleLine size={28}/>
                </button>
            )}
            <button onClick={onSkipForward} aria-label="Skip Forward">
                <RiSkipForwardFill />
            </button>
        </div>
    );
};

export default TimerControls;