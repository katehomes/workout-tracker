import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExerciseById, type Exercise } from '../../api/exerciseApi';

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (id) {
      getExerciseById(id).then(setExercise).catch(console.error);
    }
  }, [id]);

  if (!exercise) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">{exercise.title}</h2>
      <p className="text-gray-600 mb-2">{exercise.tags.join(', ')}</p>
      <ol className="list-decimal list-inside mb-4">
        {exercise.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <div className="grid grid-cols-2 gap-4">
        {exercise.media.map((item, i) => (
          <div key={i} className="rounded overflow-hidden shadow">
            {item.type === 'image' || item.type === 'gif' ? (
              <img src={item.url} alt={item.caption || ''} className="w-full" />
            ) : (
              <video src={item.url} controls className="w-full" />
            )}
            {item.caption && <p className="text-xs text-center mt-1">{item.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseDetail;
