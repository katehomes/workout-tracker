import React, { useEffect, useState } from 'react';
import { getExerciseById, type Exercise } from '../../api/exerciseApi';
import { getDifficultyClass } from './ExerciseFilter';

interface Props {
  id?: string;
  exercise?: Exercise;
}

const ExerciseDetail: React.FC<Props> = ({ id, exercise: propExercise }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id && !propExercise);

useEffect(() => {
  if (propExercise) {
    setExercise(propExercise);
    setLoading(false);
  } else if (id) {
    setLoading(true);
    getExerciseById(id)
      .then((data) => setExercise(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [id, propExercise]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!exercise) return <div className="p-6 text-red-600">Exercise not found.</div>;

  const uniqueTags = Array.from(new Set(exercise.tags));

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-3xl font-bold capitalize">{exercise.title}</h2>
      <span className={`px-2 py-1 rounded-full border ${getDifficultyClass(exercise.difficulty)}`}>
        <strong>{exercise.difficulty}</strong>
      </span>
      <div className="text-gray-600">Tags: {uniqueTags.join(', ')}</div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Steps</h3>
        <ol className="list-decimal ml-6 space-y-1">
          {exercise.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {exercise.media && exercise.media.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Media</h3>
          <div className="flex flex-wrap gap-4">
            {exercise.media.map((item, i) => (
              <div key={i} className="space-y-2">
                {item.type === 'gif' || item.type === 'image' ? (
                  <img src={item.url} alt={item.caption} className="max-w-xs rounded shadow" />
                ) : item.type === 'video' ? (
                  <video src={item.url} controls className="max-w-xs rounded shadow" />
                ) : null}
                <p className="text-sm text-gray-500">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
