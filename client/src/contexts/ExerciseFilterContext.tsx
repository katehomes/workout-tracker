import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ExerciseFilterContextProps {
  search: string;
  setSearch: (val: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  difficulty: string | null;
  setDifficulty: (val: string | null) => void;
}

const ExerciseFilterContext = createContext<ExerciseFilterContextProps | undefined>(undefined);

export const ExerciseFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <ExerciseFilterContext.Provider
      value={{ search, setSearch, selectedTags, toggleTag, difficulty, setDifficulty }}
    >
      {children}
    </ExerciseFilterContext.Provider>
  );
};

export const useExerciseFilter = () => {
  const context = useContext(ExerciseFilterContext);
  if (!context) throw new Error('useExerciseFilter must be used within ExerciseFilterProvider');
  return context;
};