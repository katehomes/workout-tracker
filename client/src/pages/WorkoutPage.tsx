import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import WorkoutList from '../components/workout/WorkoutList';
import WorkoutEditor from '../components/workout/WorkoutEditor';
// import WorkoutDetail from '../components/workout/WorkoutDetail';
import type { Workout } from '../types/types';
import { WorkoutFilterProvider } from '../contexts/WorkoutFilterContext';
import WorkoutFilter from '../components/workout/WorkoutFilter';
import SetOrderEditor from '../components/workout/SetOrderEditor';

const WorkoutPage: React.FC = () => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);
  const [draftWorkout, setDraftWorkout] = useState<Partial<Workout> | null>(null);

  return (
    <WorkoutFilterProvider>
        <PageLayout
            leftPanel={
                isEditorPanelOpen && draftWorkout ? (
                    // <WorkoutDetail workout={draftWorkout as Workout} />
                    <>
                        <h2 className="text-lg font-bold mb-4">Edit Set Order</h2>
                        <SetOrderEditor
                            title={draftWorkout.title!}
                            sets={draftWorkout.sets!}
                            setOrder={draftWorkout.setOrder!}
                            setSetOrder={(newOrder) => setDraftWorkout({ ...draftWorkout, setOrder: newOrder })}
                        />
                    </>
                ) : <WorkoutFilter />}
            rightPanel={
                isEditorPanelOpen && draftWorkout ? (
                    <>
                        {/* <h2 className="text-lg font-bold mb-4">Edit Set Order</h2>
                        <SetOrderEditor
                            title={draftWorkout.title!}
                            sets={draftWorkout.sets!}
                            setOrder={draftWorkout.setOrder!}
                            setSetOrder={(newOrder) => setDraftWorkout({ ...draftWorkout, setOrder: newOrder })}
                        /> */}
                    </>
                ) : null
            }
        >
        {isEditorPanelOpen ? (
            <WorkoutEditor
                closePanel={() => setIsEditorPanelOpen(false)}
                setDraft={setDraftWorkout}
                id={selectedWorkoutId || undefined}
                draft={draftWorkout}
            />
        ) : (
            <div className="p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => {
                    setSelectedWorkoutId(null);
                    setIsEditorPanelOpen(true);
                }}
                >
                Create New Workout
                </button>
            </div>
            <WorkoutList
                onSelect={(id: string) => setSelectedWorkoutId(id)}
                setEditorPanelOpen={setIsEditorPanelOpen}
            />
            </div>
        )}
        </PageLayout>
    </WorkoutFilterProvider>
  );
};

export default WorkoutPage;
