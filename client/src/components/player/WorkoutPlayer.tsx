import React, { useEffect, useState } from 'react';
import type { Exercise, Workout, WorkoutSet } from "../../types/types";
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout } from '../../api/workouts';
import TimerControls from './TimerControls';
import TimerDisplay, { formatTime } from './TimerDisplay';
import { groupSetOrder } from '../SetOrderEditor';
import FullExerciseOrderList from './FullExerciseOrderList';

const REST_SECONDS = 7; // Default rest time in seconds

export interface WorkoutEntry {
  setId: number;
  setOrderIndex: number;
  completed: boolean;
  exercises: ExerciseEntry[];
}

export interface ExerciseEntry {
  exercise: Exercise;
 exOrderIndex: number;
  completed: boolean;
  setOrderIndex: number;
}

const getOrderEntries = (_setOrder: number[], _sets: WorkoutSet[]): WorkoutEntry[] => {
    const entries: WorkoutEntry[] = [];
    _setOrder.forEach((setId, index) => {
        const set =_sets[setId];
        if (!set) {
            console.warn(`Set with ID ${setId} not found in sets array.`);
            return;
        }

        const exerciseEntries: ExerciseEntry[] = [];

        set.exercises.forEach((exercise, exIndex) => {
            exerciseEntries.push({ exercise, completed: false, exOrderIndex: exIndex, setOrderIndex: index});
        });
        entries.push({ setId, setOrderIndex: index, completed: false, exercises: exerciseEntries});
    });
    return entries;
}

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
    const [title, setTitle] = useState(selectedWorkout.title);
    const [tags, setTags] = useState('');
    const [sets, setSets] = useState<WorkoutSet[]>([]);
    const [setOrder, setSetOrder] = useState<number[]>([]);
    const [workoutOrderEntries, setWorkoutOrderEntries] = useState<WorkoutEntry[]>(getOrderEntries([], []));

    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(5);  
    const [isBreak, setIsBreak] = useState(false);

    const [currentSet, setCurrentSet] = useState<WorkoutEntry | null>(null);
    const [currentExercise, setCurrentExercise] = useState<ExerciseEntry | null>(null);
    

    const navigate = useNavigate();

    const initializeWorkout = () => {
        console.log("Initializing workout...");

        setCurrentSet(workoutOrderEntries[0]);

        setCurrentExercise(workoutOrderEntries[0].exercises[0]);

        setTimer(currentExercise?.exercise.duration || 5);
    }

    useEffect(() => {
      if (!id) return;
      getWorkout(id)
        .then((data) => {
        console.log("Workout data loaded:", data);
            setTitle(data.title);
            setTags(data.tags?.join(', ') ?? '');
            setSets(data.sets || []);
            setSetOrder(data.setOrder);
            setWorkoutOrderEntries(getOrderEntries(data.setOrder, data.sets || []));    
        })
        .then(() => {
            console.log("WorkoutOrderEntries", workoutOrderEntries);
            initializeWorkout();
        })
        .catch((err) => console.error('Failed to load workout:', err));
        
    }, [id]);

    useEffect(() => {
        if (workoutOrderEntries.length > 0 && !currentExercise) {
            const firstSet = workoutOrderEntries[0];
            if(firstSet) {
                setCurrentSet(firstSet);
                const firstExercise = workoutOrderEntries[0]?.exercises?.[0];
                if (firstExercise) {
                    setCurrentExercise(firstExercise);
                    setTimer(firstExercise.exercise.duration || 5);
                }
            }
        }
    }, [workoutOrderEntries, currentExercise, currentSet]);


    useEffect(() => {
        if (!isRunning) return;

        if (timer === 0) {
            console.log("Timer complete");
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
            setIsBreak(false);
            startNextSet();
        } else {
            console.log("Timer completed for current exercise");
            console.log("current set", currentSet);
            console.log("current currentExercise", currentExercise);
            markExerciseComplete(currentSet?.setOrderIndex!, currentExercise?.exOrderIndex!);

            const currentSetObj = sets[currentSet?.setId!];
            const nextExerciseIndex = currentExercise?.exOrderIndex! + 1;

            if (nextExerciseIndex < currentSetObj.exercises.length) {
                setCurrentExercise({...currentSet!.exercises[nextExerciseIndex]});
                setTimer(currentSetObj.exercises[nextExerciseIndex].duration  || 5);
            } else {
                endOfSet();
            }
        }
    };

    const markExerciseComplete = (setOrderIndex: number, exIndex: number) => {
        setWorkoutOrderEntries(prevEntries => {
            return prevEntries.map((entry, i) => {
                if (i !== setOrderIndex) return entry;

                const updatedExercises = entry.exercises.map((ex, j) =>
                    j === exIndex ? { ...ex, completed: true } : ex
                );
                const isSetDone = updatedExercises.every(e => e.completed);

                return {
                    ...entry,
                    exercises: updatedExercises,
                    completed: isSetDone,
                };
            });
    })};
        
    const endOfSet = () => {
        startBreak();
    }

    const startBreak = () => {
        setIsBreak(true);
        setTimer(REST_SECONDS);
    }

    const startNextSet = () => {
        const nextSetIndex = currentSet?.setOrderIndex! + 1;
        if (nextSetIndex < workoutOrderEntries.length) {
            const nextSetId = workoutOrderEntries[nextSetIndex].setId;
            setCurrentSet(workoutOrderEntries[nextSetIndex]);
            setCurrentExercise(workoutOrderEntries[nextSetIndex].exercises[0]);
            setTimer(sets[nextSetId]?.exercises[0]?.duration  || 5);
        } else {
            setIsRunning(false);
            console.log("🎉 Workout complete!");
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

    const currentSetTitle = sets[currentSet?.setId!]?.title?.trim() || `Set ${currentSet?.setOrderIndex! + 1}`;
    const currentExerciseObj = currentExercise?.exercise;

    const currentExerciseTitle = currentExerciseObj?.title?.trim() || `Exercise ${currentExercise?.exOrderIndex! + 1}`;
    const currentExerciseInstructions = currentExerciseObj?.instructions || 'No instructions available';
    const currentExerciseDuration = currentExerciseObj?.duration || 1; // fallback to avoid /0
    const currentExPerWidth = Math.round((timer / currentExerciseDuration) * 100);


    return (<>
        <div id="player-grid" className="grid grid-cols-[25%_75%]">
            <div className="p-4 border-1">left</div>
            <div className="p-4 border-1">
                <button
                    onClick={() => navigate('/workouts')}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                    ← Back
                </button>
            </div>

        </div>

        <div className="grid grid-cols-[25%_50%_25%]  bg-amber-400 h-[90vh]">  
            <div id='player-left' className="col-span-1 row-span-3 border-1 h-100%">
                left side
            </div>  
            <div id='player-middle' className="col-span-1 row-span-3 border-1 h-100% grid grid-rows-[40%_40%_20%]">
                <div className="min-h-[90vh] bg-gray-100 flex flex-col items-center justify-center overflow-hidden  ">
                    <div className="relative max-w-xl w-full h-36 bg-white rounded-lg shadow-lg overflow-hidde mb-10">
                        <div className="absolute inset-0 rounded-lg overflow-hidden bg-red-200">
                            <img alt="" className='object-cover w-full h-full'
                                src="https://gymcrafter.com/wp-content/uploads/2017/11/dumbbells-1474426_1920-1024x683.jpg"/>
                            <div className="absolute inset-0 backdrop backdrop-blur-10 bg-gradient-to-b from-transparent to-black"></div>
                        </div>
                        <div className="absolute flex space-x-6 transform translate-x-6 translate-y-8">
                            <div className="w-36 h-36 rounded-lg shadow-lg overflow-hidden">
                                <img alt="" className='object-cover w-full h-full'
                                    src="https://gymcrafter.com/wp-content/uploads/2017/11/dumbbells-1474426_1920-1024x683.jpg"/>
                            </div>
                            <div className="text-white pt-12">
                                <h3 className="font-bold">{title}</h3>
                                <div className="text-sm opacity-60">~{duration} min | {tags}</div>
                                <div className="mt-8 text-gray-400">
                                <div className="flex items-center space-x-2 text-xs">
                                    <span>{setSummary}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&h=250&q=80"
                                className="object-cover"
                            />
                            <div className="absolute p-4 inset-0 flex flex-row justify-between bg-gradient-to-b from-transparent to-gray-900 backdrop backdrop-blur-5 text-white">
                                <h3 className="font-bold">Current Set: {currentSetTitle}</h3>
                                <div>
                                    <div className="opacity-70">0/0 Exercises Left In Set</div>
                                    <span className="opacity-70">0/0 Exercises Left In Workout</span>
                                </div>
                            </div>  
                            <div className="absolute p-4 inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-900 backdrop backdrop-blur-5 text-white">
                                <h3 className="font-bold">Current Exercise: {currentExerciseTitle}</h3>
                                <span className="opacity-70">{currentExerciseInstructions}</span>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="relative h-2 bg-gray-200 rounded overflow-hidden">
                                <div 
                                className="absolute h-full bg-green-500 flex items-center justify-end transition-all duration-300"
                                style={{ width: `${currentExPerWidth}%` }}
                                >
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between text-xs font-semibold text-gray-500 px-4 py-2">
                            <div>1:50</div>
                            <div className="flex flex-col space-x-3 p-2">
                                {isBreak && <div className="text-yellow-500 text-sm">Break time!</div>}
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
                                <TimerDisplay seconds={timer}/>
                            </div>
                            <div>3:00</div>
                        </div>    
                        
                    </div>
                    
                </div>
            </div>  
            <div id='player-right' className="col-span-1 row-span-3 border-1 h-100%">
                <FullExerciseOrderList
                    workoutOrderEntries={workoutOrderEntries}
                    setWorkoutOrderEntries={setWorkoutOrderEntries}
                    currentExercise={currentExercise}
                    isRunning={isRunning}
                    setOrder={setOrder}
                    sets={sets}
                    />

            </div>
        </div>
        </>
    );
};

export default WorkoutPlayer;