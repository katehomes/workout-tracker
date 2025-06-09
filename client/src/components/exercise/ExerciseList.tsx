import React, { useEffect, useState } from 'react';
import { getAllExercises, type Exercise } from '../../api/exerciseApi';
import { data, Link } from 'react-router-dom';

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    getAllExercises().then( (data) => {
      console.log("exdata", data);
      // Assuming data is an array of Exercise objects
      setExercises(data);
    }
      
    ).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercises</h2>
      <ul className="space-y-4">
        {exercises.map((exercise) => (
          <li key={exercise._id} className="p-4 border rounded shadow bg-white">
            <Link to={`/exercises/${exercise._id}`}>
              <h3 className="text-lg font-semibold">{exercise.title}</h3>
              <p className="text-sm text-gray-500">{exercise.tags.join(', ')}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
