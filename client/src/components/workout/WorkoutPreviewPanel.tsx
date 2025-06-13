import React, { useEffect, useState } from 'react';
import type { WorkoutSet, Exercise } from '../../types/types';
import { useWorkoutDraft } from '../../contexts/WorkoutDraftContext';
import { formatTime } from '../player/TimerDisplay';
interface WorkoutEntry {
  setId: number;
  setOrderIndex: number;
  exercises: { exercise: Exercise; completed: boolean }[];
  completed: boolean;
}

const generateWorkoutOrderEntries = (
  sets: WorkoutSet[],
  setOrder: number[]
): WorkoutEntry[] => {
  return setOrder.map((setId, orderIndex) => {
    const set = sets[setId];
    const exercises = set.exercises.map((exercise) => ({
      exercise,
      completed: false,
    }));
    return {
      setId,
      setOrderIndex: orderIndex,
      exercises,
      completed: false,
    };
  });
};

const WorkoutPreviewPanel: React.FC = () => {
  const { draft } = useWorkoutDraft();
  const sets = draft.sets || [];
  const setOrder = draft.setOrder || [];

  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  useEffect(() => {
    if (sets.length && setOrder.length) {
      const generated = generateWorkoutOrderEntries(sets, setOrder);
      setEntries(generated);
    }
  }, [sets, setOrder]);

  const workoutPercentCompleted = Math.round(
    (entries.filter(entry => entry.completed).length / entries.length) * 100
  );

  return (
    <div className="bg-white rounded shadow border overflow-hidden">
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Workout Preview</span>
      </div>

      <div className="relative h-1 bg-gray-200">
        {[...entries].reverse().map((entry, i) => {
          const width = ((setOrder.length - i) / setOrder.length) * 100;
          return (
            <div
              key={`preview-bar-${i}`}
              className={`absolute top-0 left-0 h-full bg-blue-500`}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>

      <div className="h-full overflow-y-auto custom-scrollbar">
        <ul className="divide-y">
          {entries.map((entry, orderIndex) => {
            const setTitle = sets[entry.setId]?.title?.trim() || `Set ${entry.setId + 1}`;
            return (
              <React.Fragment key={`entry-${orderIndex}`}>
                <li className="px-4 py-2 font-medium bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span>{`#${orderIndex + 1} - ${setTitle}`}</span>
                  </div>
                </li>
                {entry.exercises.map((ex, exIndex) => (
                  <li
                    key={`exercise-${orderIndex}-${exIndex}`}
                    className="px-6 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <span>{ex.exercise.title}</span>
                      <span className="text-xs text-gray-500">{formatTime(ex.exercise.duration)}</span>
                    </div>
                  </li>
                ))}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutPreviewPanel;
