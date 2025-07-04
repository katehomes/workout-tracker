import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { getWorkout } from '../api/workouts';
import { updateWorkout } from '../api/workouts';

import { Workout, WorkoutSet, Exercise } from '../types/types';

const WorkoutEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const navigate = useNavigate();



  useEffect(() => {
    if (!id) return;
    getWorkout(id)
      .then((data) => {
        setTitle(data.title);
        setTags(data.tags?.join(', ') ?? '');
        setSets(data.sets || []);
      })
      .catch((err) => console.error('Failed to load workout:', err));
  }, [id]);

  const handleSetChange = <K extends keyof WorkoutSet>(
    index: number,
    field: K,
    value: WorkoutSet[K]
  ) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleExerciseChange = <K extends keyof Exercise>(
    setIndex: number,
    exIndex: number,
    field: K,
    value: Exercise[K]
  ) => {
    const newSets = [...sets];
    newSets[setIndex].exercises[exIndex][field] = value;
    setSets(newSets);
  };

  const addSet = () => {
    const newSet: WorkoutSet = {
      repeat: 1,
      order: sets.length,
      exercises: [],
    };
    setSets([...sets, newSet]);
  };

  const addExercise = (setIndex: number) => {
    const newSets = [...sets];
    newSets[setIndex].exercises.push({
      title: '',
      duration: 0,
      order: newSets[setIndex].exercises.length,
    });
    setSets(newSets);
  };

  const setSummary = sets
  .map((set, i) => {
    const label = set.title?.trim() ? set.title : `Set ${i + 1}`;
    return set.repeat && set.repeat > 1 ? `${label} (x${set.repeat})` : label;
  })
  .join(' -> ');

  const handleSave = async () => {
    try {
      const workoutToSave = {
        title,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        sets,
      };

      if (id) {
        await updateWorkout(id, workoutToSave);
        setSaveMessage('Workout updated successfully!');
        setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3s
      } else {
        console.warn('No ID provided – cannot save.');
      }
    } catch (err) {
      console.error('Failed to save workout:', err);
      setSaveMessage('❌ Error saving workout.');
      setTimeout(() => setSaveMessage(null), 5000); // Clear error message slower
    }
  };



  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate('/workouts')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Workout
        </button>
      </div>

      {saveMessage && (
        <div className="text-sm text-green-700 bg-green-100 border border-green-300 rounded px-3 py-1 w-fit mb-2">
          {saveMessage}
        </div>
      )}

      <h2 className="text-xl font-bold">Edit Workout</h2>

      <input
        type="text"
        placeholder="Workout Title"
        className="input input-bordered w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="input input-bordered w-full"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <div className="text-sm text-gray-600 italic">{setSummary}</div>

      <div className="flex overflow-x-auto gap-4 pb-4">
        {sets.map((set, setIndex) => (
          <div key={setIndex} className="min-w-[300px] max-w-[auto] flex-shrink-0 border p-4 rounded bg-gray-100">
            <input
              type="text"
              placeholder={`Title: Set ${setIndex + 1} (optional)`}
              className="input input-bordered w-full mb-2"
              value={set.title || ''}
              onChange={(e) => handleSetChange(setIndex, 'title', e.target.value)}
            />

            <div className="mb-2">
              <label className="font-semibold">Repeat</label>
              <input
                type="number"
                className="input input-bordered ml-2 w-20"
                value={set.repeat}
                onChange={(e) => handleSetChange(setIndex, 'repeat', parseInt(e.target.value))}
              />
            </div>

            <h4 className="font-semibold">Exercises</h4>
            {set.exercises.map((ex, exIndex) => (
              <div key={exIndex} className="mb-4 bg-white p-3 rounded shadow space-y-2">
                <div>
                  <label className="w-32 font-semibold text-sm">Title: </label>
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={ex.title}
                    onChange={(e) =>
                      handleExerciseChange(setIndex, exIndex, 'title', e.target.value)
                    }
                    placeholder="e.g., Jumping Jacks"
                  />
                </div>
                <div>
                  <label className="w-32 font-semibold text-sm">Duration (s): </label>
                  <input
                    type="number"
                    className="input input-bordered w-auto max-w-[80px]"
                    placeholder="e.g., 30"
                    value={ex.duration}
                    onChange={(e) =>
                      handleExerciseChange(setIndex, exIndex, 'duration', parseInt(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="w-32 font-semibold text-sm">Instructions: </label>
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    value={ex.instructions || ''}
                    onChange={(e) =>
                      handleExerciseChange(setIndex, exIndex, 'instructions', e.target.value)
                    }
                    placeholder="e.g., Keep back straight"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => addExercise(setIndex)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              + Add Exercise
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSet}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add WorkoutSet
      </button>
    </div>
  );
};

export default WorkoutEditor;
