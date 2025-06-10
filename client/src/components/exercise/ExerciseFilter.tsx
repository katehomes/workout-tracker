import { useExerciseFilter } from '../../contexts/ExerciseFilterContext';
import { MUSCLES, DIFFICULTIES } from '../../constants/exerciseConstants';


export const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-500 text-white';
    case 'Moderate':
      return 'bg-yellow-300 text-gray-800';
    case 'Challenging':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
}};

const ExerciseFilter = () => {
  const { search, setSearch, selectedTags, toggleTag, setDifficulty } = useExerciseFilter();

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-700">Difficulty:</label>
        <select
          onChange={(e) => setDifficulty(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {DIFFICULTIES.map((difficulty) => (
            <option
              key={difficulty}
              value={difficulty}
              className={getDifficultyClass(difficulty)}
            >
              {difficulty}
            </option>
          ))}
          <option value="">All</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {MUSCLES.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseFilter;
