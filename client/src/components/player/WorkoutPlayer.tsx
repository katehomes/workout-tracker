import React, { useEffect, useState } from 'react';
import type { Exercise, Workout, WorkoutSet } from "../../types/types";
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkout } from '../../api/workouts';
import TimerControls from './TimerControls';
import TimerDisplay, { formatTime } from './TimerDisplay';
import { groupSetOrder } from '../SetOrderEditor';

const REST_SECONDS = 30; // Default rest time in seconds

interface WorkoutEntry {
  setId: number;
  setIndex: number;
  completed: boolean;
  exercises: ExerciseEntry[];
}

interface ExerciseEntry {
  exercise: Exercise;
    exerciseIndex: number;
  completed: boolean;
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
            exerciseEntries.push({ exercise, completed: false, exerciseIndex: exIndex });
        });
        entries.push({ setId, setIndex: index, completed: false, exercises: exerciseEntries});
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

    const [currentSet, setCurrentSet] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timer, setTimer] = useState(5);  
    const [isBreak, setIsBreak] = useState(false);

    const navigate = useNavigate();

    const initializeWorkout = (workout: Workout) => {
        setTitle(selectedWorkout.title);
    }

    useEffect(() => {
      if (!id) return;
      getWorkout(id)
        .then((data) => {
          setTitle(data.title);
          setTags(data.tags?.join(', ') ?? '');
          setSets(data.sets || []);
          setSetOrder(data.setOrder || data.sets.map((_, i) => i));
          setWorkoutOrderEntries(getOrderEntries(data.setOrder || data.sets.map((_, i) => i), data.sets || []));
        })
        .catch((err) => console.error('Failed to load workout:', err));
        console.log("WorkoutOrderEntries", workoutOrderEntries);
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

        <div className="grid grid-cols-[25%_75%]  bg-amber-400 h-[90vh]">  
            <div id='player-left' className="col-span-1 row-span-3 border-1 h-100%">
                <div className=" bg-white shadow-lg overflow-hidden">
                    <div className="relative h-10">
                        <div className="absolute pl-4 pt-2 inset-0 backdrop backdrop-blur-10 bg-gradient-to-b from-transparent to-black backdrop backdrop-blur-5 text-white">
                            <h3 className="font-bold">Set List & Excerises</h3>
                        </div>
                    </div>
                    <div>
                        <div className="relative h-1 bg-gray-200">
                            {[...workoutOrderEntries].reverse().map((entry, orderIndex) => {
                                const percentWidth = ((setOrder.length - orderIndex) / setOrder.length) * 100;
                                const bgColor = entry.completed ? 'bg-green-500' : 'bg-blue-500';
                                //console.log("entry", sets[entry.setId].title ,"entry", entry, "orderIndex", orderIndex, "percentWidth", percentWidth, "bgColor", bgColor);
                                return (
                                    <div
                                        key={`${entry}-${orderIndex}`}
                                        className={`absolute h-full flex items-center justify-end ${bgColor}`}
                                        style={{ width: `${percentWidth}%` }}
                                    >
                                        <div className="rounded-full w-5 h-5 bg-white shadow text-xs flex justify-center items-center">{setOrder.length - orderIndex}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className='overflow-y-auto max-h-[80vh]'>
                        <ul className="text-xs sm:text-base divide-y border-t cursor-default">
                            {workoutOrderEntries.map((entry, orderIndex) => {
                                const setId = entry.setId;
                                const setTitle = sets[setId]?.title?.trim() || `Set ${setId + 1}`;
                                const entryTitle = `${setTitle} | completed: ${entry.completed}`;
                                const completedExercises = entry.exercises.filter(ex => ex.completed).length;
                                const strikethStyle = entry.completed ? 'line-through' : '';

                                return (
                                    <>
                                        <li key={`-${orderIndex}-set-${setId}`}
                                            className="flex items-center space-x-3 bg-yellow-300 hover:bg-yellow-100"
                                        >
                                            <div className={`flex-1 ml-10 ${strikethStyle}`}>{entryTitle}</div>
                                            <div className="text-xs text-gray-400">
                                                {completedExercises}/{entry.exercises.length}
                                            </div>
                                            <button className="focus:outline-none pr-4 group">
                                                
                                                <input
                                                    disabled
                                                    type="checkbox"
                                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                                                    checked={completedExercises == entry.exercises.length}
                                                    onChange={(e) => {
                                                        setWorkoutOrderEntries(prevEntries =>
                                                            prevEntries.map((item, idx) =>
                                                                idx === orderIndex ? { ...item, completed: e.target.checked } : item
                                                            )
                                                        );
                                                    }}
                                                />

                                            </button>
                                        </li>
                                        {entry.exercises.map((ex, exIndex) => {
                                            const exercise = ex.exercise;
                                            const strikethStyle = ex.completed ? 'line-through' : '';

                                            return (
                                                <li key={`-${orderIndex}-exercise-${setId}-${exIndex}`}
                                                    className={`flex items-center space-x-3 hover:bg-gray-100 ${strikethStyle}`}
                                                >
                                                    <button className="p-3 hover:bg-green-500 group focus:outline-none">
                                                        { currentExercise === exIndex && isRunning ? (
                                                            <svg className="w-4 h-4 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="12" height="16" rx="2"></rect></svg>
                                                        ) : (
                                                            <p>#{exIndex}</p>
                                                        )}
                                                    </button>
                                                    <div className="flex-1 ml-10">{exercise.title}</div>
                                                    <div className="text-xs text-gray-400">{formatTime(exercise.duration)}</div>
                                                    <button className="focus:outline-none pr-4 group">
                                                        <input type="checkbox" value="" 
                                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                            onChange={(e) => {
                                                                setWorkoutOrderEntries(prevEntries => {
                                                                    return prevEntries.map((item, idx) => {
                                                                        if (idx === orderIndex) {
                                                                            const updatedExercises = item.exercises.map((exItem, exIdx) =>
                                                                                exIdx === exIndex
                                                                                    ? { ...exItem, completed: e.target.checked }
                                                                                    : exItem
                                                                            );

                                                                            // Check if all exercises are completed to auto-update set completion
                                                                            const allCompleted = updatedExercises.every(ex => ex.completed);

                                                                            return {
                                                                                ...item,
                                                                                exercises: updatedExercises,
                                                                                completed: allCompleted, // update set-level completion automatically
                                                                            };
                                                                        }
                                                                        return item;
                                                                    });
                                                                });
                                                            }}
                                                        ></input>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>  
            <div id='player-right' className="col-span-1 row-span-3 border-1 h-100% grid grid-rows-[40%_40%_20%]">
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
                                <h3 className="font-bold">Current Set</h3>
                                <div>
                                    <div className="opacity-70">0/0 Exercises Left In Set</div>
                                    <span className="opacity-70">0/0 Exercises Left In Workout</span>
                                </div>
                            </div>
                            <div className="absolute p-4 inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-900 backdrop backdrop-blur-5 text-white">
                                <h3 className="font-bold">Current Exercise</h3>
                                <span className="opacity-70">Instruction</span>
                            </div>
                        </div>
                        <div>
                            <div className="relative h-1 bg-gray-200">
                                <div className="absolute h-full w-1/2 bg-green-500 flex items-center justify-end">
                                    <div className="rounded-full w-3 h-3 bg-white shadow"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500 px-4 py-2">
                            <div>1:50</div>
                            <div className="flex flex-col space-x-3 p-2">
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
            
        </div>
        </>
    );
};

export default WorkoutPlayer;