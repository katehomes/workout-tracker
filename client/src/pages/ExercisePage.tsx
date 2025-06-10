    import React, { useState } from 'react';
    import PageLayout from '../components/layout/PageLayout';
    import ExerciseList from '../components/exercise/ExerciseList';
    import ExerciseFilter from '../components/exercise/ExerciseFilter';
    import { ExerciseFilterProvider } from '../contexts/ExerciseFilterContext';
    import ExerciseDetail from '../components/exercise/ExerciseDetail';
    import CreateExercisePanel from '../components/exercise/ExerciseEditor';
    import type { Exercise } from '../api/exerciseApi';

    const ExercisePage: React.FC = () => {
        const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
        const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
        const [draftExercise, setDraftExercise] = useState<Partial<Exercise> | null>(null);


        return (
            <ExerciseFilterProvider>
                <PageLayout
                    leftPanel={<ExerciseFilter />}
                    rightPanel={
                        isCreatePanelOpen && draftExercise ? (
                            <ExerciseDetail exercise={draftExercise as Exercise} />
                        ) : selectedExerciseId ? (
                            <ExerciseDetail id={selectedExerciseId} />
                        ) : null
                    }

                >
                    {isCreatePanelOpen ? (
                        <CreateExercisePanel 
                            closePanel={() => setIsCreatePanelOpen(false)}
                            setDraft={setDraftExercise}
                            id={selectedExerciseId || undefined}
                        />

                    ) : (
                    <div className="p-6 space-y-6">
                    

                        <div className="flex justify-between items-center mb-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                onClick={() => {
                                    setSelectedExerciseId(null);
                                    setIsCreatePanelOpen(true)
                                }}
                            >
                                Create New Exercise
                            </button>
                        </div>
                        <ExerciseList 
                            onSelect={function (id: string): void {
                                setSelectedExerciseId(id);
                            }} 
                            setEditorPanelOpen={setIsCreatePanelOpen}
                        />
                    </div>
                    )}
                </PageLayout>
            </ExerciseFilterProvider>
        );
    };

    export default ExercisePage;
