import React, { useEffect, useState } from 'react';
import { getAllExercises, type Exercise } from '../../api/exerciseApi';
import { Link } from 'react-router-dom';
import { useExerciseFilter } from '../../contexts/ExerciseFilterContext';
import { getDifficultyClass } from './ExerciseFilter';

interface Props {
  onSelect: (id: string) => void;
}



const ExerciseList: React.FC<Props> = ({ onSelect }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { search, selectedTags, difficulty } = useExerciseFilter();

  useEffect(() => {
    getAllExercises().then(setExercises).catch(console.error);
  }, []);

  const filtered = exercises.filter((ex) => {
    const titleMatch = ex.title.toLowerCase().includes(search.toLowerCase());
    const tagMatch = ex.tags.some(tag =>
      tag.toLowerCase().includes(search.toLowerCase())
    );

    const matchesSearch = !search || titleMatch || tagMatch;
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => ex.tags.includes(tag));
    const matchesDifficulty = !difficulty || ex.difficulty === difficulty;

    return matchesSearch && matchesTags && matchesDifficulty;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercises</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No exercises match your filters.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((exercise) => {
            const previewImg = exercise.media?.find((m) => m.type === 'image')?.url;

            return (
              <li
                key={exercise._id}
                className="flex border rounded shadow bg-white cursor-pointer hover:bg-gray-50 transition max-w-md"
                onClick={() => onSelect(exercise._id!)}
              >
                {previewImg && (
                  <img
                    src={previewImg}
                    alt={exercise.title}
                    className="w-24 h-24 object-cover rounded-l"
                  />
                )}
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="text-md font-semibold capitalize">{exercise.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className={`px-2 py-1 rounded-full border ${getDifficultyClass(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="ml-2">{exercise.tags.join(', ')}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ExerciseList;
