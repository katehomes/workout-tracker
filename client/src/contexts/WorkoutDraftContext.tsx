// WorkoutDraftContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Workout, WorkoutSet } from '../types/types';

interface WorkoutDraftContextProps {
  draft: Partial<Workout>;
  selectedWorkoutId: string | null;
  setSelectedWorkoutId: (id: string | null) => void;
  closeEditorPanel: () => void;
  resetDraft: (initial?: Partial<Workout>) => void;
  isEditorPanelOpen: boolean;
  setIsEditorPanelOpen:(isOpen: boolean) => void;
  setTitle: (title: string) => void;
  setTags: (tags: string[]) => void;
  setSets: (sets: WorkoutSet[]) => void;
  setSetOrder: (order: number[]) => void;
}

const WorkoutDraftContext = createContext<WorkoutDraftContextProps | undefined>(undefined);

export const WorkoutDraftProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<Partial<Workout>>({
    title: '',
    tags: [],
    sets: [],
    setOrder: [],
  });

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);

  const resetDraft = useCallback((initial?: Partial<Workout>) => {
    setDraft(initial || { title: '', tags: [], sets: [], setOrder: [] });
  }, []);

  const closeEditorPanel = () => {
    setIsEditorPanelOpen(false)
    resetDraft();
  };

  
  const setTitle = (title: string) => setDraft((d) => ({ ...d, title }));
  const setTags = (tags: string[]) => setDraft((d) => ({ ...d, tags }));
  const setSets = (sets: WorkoutSet[]) => {
    console.log("setSets");
    setDraft((d) => ({ ...d, sets }));
  }
  const setSetOrder = (setOrder: number[]) => setDraft((d) => ({ ...d, setOrder }));

  return (
    <WorkoutDraftContext.Provider
      value={{
        draft,
        selectedWorkoutId,
        setSelectedWorkoutId,
        setIsEditorPanelOpen,
        isEditorPanelOpen,
        closeEditorPanel,
        resetDraft,
        setTitle,
        setTags,
        setSets,
        setSetOrder,
      }}
    >
      {children}
    </WorkoutDraftContext.Provider>
  );
};

export const useWorkoutDraft = () => {
  const context = useContext(WorkoutDraftContext);
  if (!context) throw new Error('useWorkoutDraft must be used within WorkoutDraftProvider');
  return context;
};
