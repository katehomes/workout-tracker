import React, { useEffect, useState } from 'react';
import type { WorkoutSet, WorkoutExercise } from '../../types/types';
import { useWorkoutDraft } from '../../contexts/WorkoutDraftContext';
import { formatTime } from '../player/TimerDisplay';

interface WorkoutEntry {
  setId: number;
  setOrderIndex: number;
  exerciseEntries: { woExercise: WorkoutExercise; completed: boolean }[];
  completed: boolean;
}

const generateWorkoutOrderEntries = (
  sets: WorkoutSet[],
  setOrder: number[]
): WorkoutEntry[] => {
  return setOrder.map((setId, orderIndex) => {
    const set = sets[setId];
    const exerciseEntries = set.exercises.map((woExercise) => ({
      woExercise,
      completed: false,
    }));
    return {
      setId,
      setOrderIndex: orderIndex,
      exerciseEntries,
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
                {entry.exerciseEntries.map((exEntry, exIndex) => {
                  const exObj = exEntry.woExercise.exercise;
                  const exerciseTitle = typeof exObj === 'string'
                    ? `Exercise ID: ${exObj}`
                    : exObj.title || 'Untitled Exercise';
                  const exDuration = formatTime(exEntry.woExercise.duration) || '--:--';
                  return(
                    <li
                      key={`exercise-${orderIndex}-${exIndex}`}
                      className="px-6 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold capitalize">
                          {exerciseTitle}
                        </span>
                        <span className="text-xs text-gray-500">{exDuration}</span>
                      </div>
                    </li>
                  )
                })}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutPreviewPanel;
