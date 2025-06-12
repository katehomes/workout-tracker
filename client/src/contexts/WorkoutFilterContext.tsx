import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface WorkoutFilterContextProps {
  search: string;
  setSearch: (val: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const WorkoutFilterContext = createContext<WorkoutFilterContextProps | undefined>(undefined);

export const WorkoutFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <WorkoutFilterContext.Provider
      value={{ search, setSearch, selectedTags, toggleTag }}
    >
      {children}
    </WorkoutFilterContext.Provider>
  );
};

export const useWorkoutFilter = () => {
  const context = useContext(WorkoutFilterContext);
  if (!context) throw new Error('useWorkoutFilter must be used within WorkoutFilterProvider');
  return context;
};
