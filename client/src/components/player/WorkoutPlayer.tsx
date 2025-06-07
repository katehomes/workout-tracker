import React, { useEffect, useState } from 'react';
import type { Workout, WorkoutSet } from "../../types/types";
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout } from '../../api/workouts';
import TimerControls from './TimerControls';
import TimerDisplay from './TimerDisplay';

const REST_SECONDS = 30; // Default rest time in seconds

interface WorkoutPlayerProps {
    selectedWorkout?: Workout;
    duration?: number; // in minutes
    onStart?: () => void;
    onPause?: () => void;
    onStop?: () => void;
}
const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
    selectedWorkout = {title: 'Select a Workout to Start', sets: [], setOrder: []},
    duration = 30,
    onStart,
    onPause,
    onStop,
}) => {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [sets, setSets] = useState<WorkoutSet[]>([]);
    const [setOrder, setSetOrder] = useState<number[]>([]);

    const [currentSet, setCurrentSet] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(5);
    const [isBreak, setIsBreak] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      if (!id) return;
      getWorkout(id)
        .then((data) => {
          setTitle(data.title);
          setTags(data.tags?.join(', ') ?? '');
          setSets(data.sets || []);
          setSetOrder(data.setOrder || data.sets.map((_, i) => i));
        })
        .catch((err) => console.error('Failed to load workout:', err));
    }, [id]);

    useEffect(() => {
        if (!isRunning) return;

        if (timer === 0) {
            handleTimerComplete();
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    
    }, [isRunning, timer]);

    const handleTimerComplete = () => {
        if (isBreak) {
            console.log("isBreak startNextExercise");
            startNextExercise();
        } else if (shouldStartBreak()) {
            console.log("shouldStartBreak");
            startBreak();
        } else {
            console.log("else startNextExercise");
            startNextExercise();
        }
    };

    const shouldStartBreak = () => {
        const set = selectedWorkout.sets[currentSet];
        if (!set || !set.exercises || set.exercises.length === 0) return false;
        const exerciseCount = set.exercises.length;
        return currentExercise < exerciseCount - 1 ;//&& selectedWorkout.sets[currentSet].restSeconds > 0;
    };

    const startBreak = () => {
        setIsBreak(true);
        setTimer(REST_SECONDS);
    };

    const startNextExercise = () => {
        setIsBreak(false);
        const set = selectedWorkout.sets[currentSet];
        if (!set || !set.exercises || set.exercises.length === 0) {
            startNextSet();
            return;
        }
        
        const exercises = selectedWorkout.sets[currentSet].exercises;
        
        if (currentExercise < exercises.length - 1) {
            setCurrentExercise(prev => prev + 1);
            setTimer(exercises[currentExercise + 1].duration);
        } else {
            startNextSet();
        }
    };

    const startNextSet = () => {
        if (currentSet < selectedWorkout.sets.length - 1) {
            setCurrentSet(prev => prev + 1);
            setCurrentExercise(0);
            setTimer(selectedWorkout.sets[currentSet + 1].exercises[0].duration);
        } else {
            setIsRunning(false);
            console.log("Workout complete!");
        }
    };

    const setSummary = (() => {
      if (!sets.length || !setOrder.length) return '';

      const chunks: { index: number; count: number }[] = [];

      for (let i = 0; i < setOrder.length; i++) {
        const index = setOrder[i];
        if (chunks.length && chunks[chunks.length - 1].index === index) {
          chunks[chunks.length - 1].count += 1;
        } else {
          chunks.push({ index, count: 1 });
        }
      }

      return chunks
        .map(({ index, count }) => {
          const label = sets[index]?.title?.trim() || `Set ${index + 1}`;
          return count > 1 ? `${label} (x${count})` : label;
        })
        .join(' → ');
    })();



    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate('/workouts')}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                    ← Back
                </button>
                <div>Currently Playing:</div>
                <div><h2>{title}</h2></div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className="workout-player">
                    <div className="flex-1 space-y-4">
                        <p>{tags}</p>
                        <p>Duration: {duration} min</p>
                        <div className="text-sm text-gray-600 italic">{setSummary}</div>
                    </div>

                    <TimerDisplay seconds={timer}/>
                    <TimerControls
                        onStart={() => setIsRunning(true)}
                        onPause={() => setIsRunning(false)}
                        onSkipBack={() => {
                            //setTimer(0); // immediately trigger completion logic
                        }}
                        onSkipForward={() => {
                            //setTimer(0); // immediately trigger completion logic
                        }}
                        isRunning={isRunning}
                    />

                    <div className="controls">
                        <button onClick={onStart}>Start</button>
                        <button onClick={onPause}>Pause</button>
                        <button onClick={onStop}>Stop</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlayer;