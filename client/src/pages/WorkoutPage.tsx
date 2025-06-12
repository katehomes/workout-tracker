import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import WorkoutList from '../components/workout/WorkoutList';
import WorkoutEditor from '../components/workout/WorkoutEditor';
// import WorkoutDetail from '../components/workout/WorkoutDetail';
import type { Workout } from '../types/types';

const WorkoutPage: React.FC = () => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [draftWorkout, setDraftWorkout] = useState<Partial<Workout> | null>(null);

  return (
    <PageLayout
      // leftPanel={<WorkoutFilter />}
    //   rightPanel={
    //     isCreatePanelOpen && draftWorkout ? (
    //       <WorkoutDetail workout={draftWorkout as Workout} />
    //     ) : selectedWorkoutId ? (
    //       <WorkoutDetail id={selectedWorkoutId} />
    //     ) : null
    //   }
    >
      {isCreatePanelOpen ? (
        <WorkoutEditor
          closePanel={() => setIsCreatePanelOpen(false)}
          setDraft={setDraftWorkout}
          id={selectedWorkoutId || undefined}
        />
      ) : (
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => {
                setSelectedWorkoutId(null);
                setIsCreatePanelOpen(true);
              }}
            >
              Create New Workout
            </button>
          </div>
          <WorkoutList
            onSelect={(id: string) => setSelectedWorkoutId(id)}
            setEditorPanelOpen={setIsCreatePanelOpen}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default WorkoutPage;
