import React from 'react';
import type { WorkoutEntry, ExerciseEntry } from './WorkoutPlayer';
import { formatTime } from './TimerDisplay';
import {
  TbPercentage,
  TbPercentage10,
  TbPercentage20,
  TbPercentage30,
  TbPercentage40,
  TbPercentage50,
  TbPercentage60,
  TbPercentage70,
  TbPercentage80,
  TbPercentage90,
  TbPercentage100
} from 'react-icons/tb';

const getPercentageIcon = (percent: number) => {
  if (percent >= 100) return <TbPercentage100 className="text-green-600" />;
  if (percent >= 90) return <TbPercentage90 className="text-green-600" />;
  if (percent >= 80) return <TbPercentage80 className="text-green-600" />;
  if (percent >= 70) return <TbPercentage70 className="text-green-600" />;
  if (percent >= 60) return <TbPercentage60 className="text-green-600" />;
  if (percent >= 50) return <TbPercentage50 className="text-green-600" />;
  if (percent >= 40) return <TbPercentage40 className="text-green-600" />;
  if (percent >= 30) return <TbPercentage30 className="text-green-600" />;
  if (percent >= 20) return <TbPercentage20 className="text-green-600" />;
  if (percent >= 10) return <TbPercentage10 className="text-green-600" />;
  return <TbPercentage className="text-green-600" />;
};

type Props = {
  workoutOrderEntries: WorkoutEntry[];
  setWorkoutOrderEntries: React.Dispatch<React.SetStateAction<WorkoutEntry[]>>;
  currentExercise: ExerciseEntry | null;
  isRunning: boolean;
  setOrder: number[];
  sets: { title?: string }[];
};

const FullExerciseOrderList: React.FC<Props> = ({
  workoutOrderEntries,
  setWorkoutOrderEntries,
  currentExercise,
  isRunning,
  setOrder,
  sets,
}) => {
  return (
    <div className="bg-white shadow-lg overflow-hidden rounded-md border border-gray-200">
      <div className="relative h-12 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 flex items-center font-semibold text-sm uppercase tracking-wide">
        Set List & Exercises
      </div>

      <div className="relative h-1 bg-gray-200">
        {[...workoutOrderEntries].reverse().map((entry, orderIndex) => {
          const percentWidth = ((setOrder.length - orderIndex) / setOrder.length) * 100;
          const bgColor = entry.completed ? 'bg-green-500' : 'bg-blue-500';
          return (
            <div
              key={`${entry.setId}-${orderIndex}`}
              className={`absolute h-full flex items-center justify-end ${bgColor}`}
              style={{ width: `${percentWidth}%` }}
            >
              <div className="rounded-full w-5 h-5 bg-white shadow text-xs flex justify-center items-center font-semibold">
                {setOrder.length - orderIndex}
              </div>
            </div>
          );
        })}
      </div>

      <div className='overflow-y-auto max-h-[75vh] custom-scrollbar'>
        <ul className="text-sm divide-y divide-gray-200 border-t border-gray-200">
          {workoutOrderEntries.map((entry, orderIndex) => {
            const setId = entry.setId;
            const setTitle = sets[setId]?.title?.trim() || `Set ${setId + 1}`;
            const completedExercises = entry.exercises.filter(ex => ex.completed).length;
            const strikeStyle = entry.completed ? 'line-through text-gray-400' : '';
            const percent = Math.round((completedExercises / entry.exercises.length) * 100);
            const isCurrent = orderIndex === currentExercise?.setOrderIndex;

            return (
              <React.Fragment key={`${orderIndex}-set-${setId}`}> 
                <li className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 ${isCurrent ? 'bg-yellow-100 border-l-4 border-yellow-400' : 'bg-gray-50'}`}>
                  <div className={`flex-1 font-medium ${strikeStyle}`}>{`${setTitle}`}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mr-2">
                    {getPercentageIcon(percent)}
                    <span>{percent}%</span>
                  </div>
                </li>
                {entry.exercises.map((ex, exIndex) => {
                  const isCurrentExercise = isCurrent && exIndex === currentExercise?.exOrderIndex;
                  return (
                    <li
                      key={`${orderIndex}-exercise-${setId}-${exIndex}`}
                      className={`flex items-center justify-between px-6 py-2 text-sm ${ex.completed ? 'line-through text-gray-400' : 'text-gray-800'} ${isCurrentExercise ? 'bg-yellow-50 border-l-2 border-yellow-300' : ''} hover:bg-gray-50`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-5 text-xs text-gray-500">#{exIndex + 1}</div>
                        <div className="font-normal">{ex.exercise.title}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-400">{formatTime(ex.exercise.duration)}</div>
                        <input
                          type="checkbox"
                          checked={ex.completed}
                          onChange={(e) => {
                            setWorkoutOrderEntries(prevEntries =>
                              prevEntries.map((item, idx) => {
                                if (idx === orderIndex) {
                                  const updatedExercises = item.exercises.map((exItem, exIdx) =>
                                    exIdx === exIndex ? { ...exItem, completed: e.target.checked } : exItem
                                  );
                                  const allCompleted = updatedExercises.every(ex => ex.completed);
                                  return {
                                    ...item,
                                    exercises: updatedExercises,
                                    completed: allCompleted,
                                  };
                                }
                                return item;
                              })
                            );
                          }}
                          className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                      </div>
                    </li>
                )})}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FullExerciseOrderList;

// Add this to your global CSS or Tailwind config:
// .custom-scrollbar::-webkit-scrollbar {
//   width: 6px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background: transparent;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background-color: #cbd5e0;
//   border-radius: 3px;
// }
// .custom-scrollbar {
//   scrollbar-width: thin;
//   scrollbar-color: #cbd5e0 transparent;
// }
