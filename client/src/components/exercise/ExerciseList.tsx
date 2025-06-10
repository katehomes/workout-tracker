import React, { useEffect, useState } from 'react';
import { getAllExercises, type Exercise } from '../../api/exerciseApi';
import { Link } from 'react-router-dom';
import { useExerciseFilter } from '../../contexts/ExerciseFilterContext';
import { getDifficultyClass } from './ExerciseFilter';

interface Props {
  onSelect: (id: string) => void;
  setEditorPanelOpen: (open: boolean) => void;
}



const ExerciseList: React.FC<Props> = ({ onSelect, setEditorPanelOpen }) => {
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
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => ex.tags.includes(tag.toLowerCase()));
    const matchesDifficulty = !difficulty || ex.difficulty === difficulty;

    return matchesSearch && matchesTags && matchesDifficulty;
  });

  const handleDoubleClick = () => {
    setEditorPanelOpen(true);
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercises</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No exercises match your filters.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
          {filtered.map((exercise) => {
            const previewImg = exercise.media?.find((m) => m.type === 'image')?.url;

            return (
              <li
                key={exercise._id}
                className="flex border rounded shadow bg-white cursor-pointer hover:bg-gray-50 transition"
                onClick={() => onSelect(exercise._id!)}
                onDoubleClick={handleDoubleClick}
              >
                {previewImg && (
                  <img
                    src={previewImg}
                    alt={exercise.title}
                    className="w-24 h-24 object-cover rounded-l"
                  />
                )}
                <div className={`w-2 h-24 ${getDifficultyClass(exercise.difficulty)}`}></div>
                <div className="p-4 flex flex-col justify-center">
                  <h3 className="text-md font-semibold capitalize">{exercise.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {exercise.tags.join(', ')}
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
