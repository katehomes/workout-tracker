import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import WorkoutList from '../components/workout/WorkoutList';
import WorkoutEditor from '../components/workout/WorkoutEditor';
import { WorkoutFilterProvider } from '../contexts/WorkoutFilterContext';
import WorkoutFilter from '../components/workout/WorkoutFilter';
import SetOrderEditor from '../components/workout/SetOrderEditor';
import { WorkoutDraftProvider, useWorkoutDraft } from '../contexts/WorkoutDraftContext';

const WorkoutPageContent: React.FC = () => {
  const {
    draft,
    selectedWorkoutId,
    setSetOrder,
    setSelectedWorkoutId,
    isEditorPanelOpen,
    setIsEditorPanelOpen,
    resetDraft,
  } = useWorkoutDraft();

  const handleCreateNew = () => {
    resetDraft();
    setSelectedWorkoutId(null);
    setIsEditorPanelOpen(true);
  };

  return (
    <WorkoutFilterProvider>
      <PageLayout
        leftPanel={
          isEditorPanelOpen && draft ? (
                <div className="p-4 space-y-4">
                    <div>
                        <h2 className="text-lg font-bold mb-4 w-full border p-2 rounded">Edit Set Order</h2>
                    </div>
                    <SetOrderEditor/>
                </div>
          ) : (
            <WorkoutFilter />
          )
        }
        rightPanel={null}
      >
        {isEditorPanelOpen ? (
          <WorkoutEditor />
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleCreateNew}
              >
                Create New Workout
              </button>
            </div>
            <WorkoutList
              onSelect={(id: string) => {
                setSelectedWorkoutId(id);
              }}
              setEditorPanelOpen={setIsEditorPanelOpen}
            />
          </div>
        )}
      </PageLayout>
    </WorkoutFilterProvider>
  );
};

const WorkoutPage: React.FC = () => (
  <WorkoutDraftProvider>
    <WorkoutPageContent />
  </WorkoutDraftProvider>
);

export default WorkoutPage;
