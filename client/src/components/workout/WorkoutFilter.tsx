import React from 'react';
import { useWorkoutFilter } from '../../contexts/WorkoutFilterContext';

const WorkoutFilter: React.FC = () => {
  const { search, setSearch, selectedTags, toggleTag } = useWorkoutFilter();

  const commonTags = [
    'strength', 'cardio', 'HIIT', 'beginner', 'advanced',
    'upper body', 'lower body', 'core', 'equipment', 'no equipment'
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workouts..."
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full border ${
                selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutFilter;
