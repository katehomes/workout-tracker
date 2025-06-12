import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { getWorkout } from '../../api/workoutsApi';
import { createWorkout, updateWorkout } from '../../api/workoutsApi';

import type { WorkoutSet, Exercise, Workout } from '../../types/types';

import { MdOutlineDeleteForever } from "react-icons/md";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { useWorkoutDraft } from '../../contexts/WorkoutDraftContext';

  const SortableExercise = ({ id, children } : {
    id: string;
    children: (props: ReturnType<typeof useSortable>) => React.ReactNode;
  }) => {
    const sortable = useSortable({ id });
    const { setNodeRef, transform, transition } = sortable;

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children(sortable)}
      </div>
    );
  };
  
  const WorkoutEditor : React.FC = () => {

    const {
      draft,
      selectedWorkoutId: id,
      resetDraft,
      setTitle,
      setTags,
      setSets,
      setSetOrder,
      setIsEditorPanelOpen
    } = useWorkoutDraft();

    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
    const [editingMap, setEditingMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
      if (!id) return;
      getWorkout(id)
        .then((data) => {
          resetDraft({
            title: data.title,
            tags: data.tags || [],
            sets: data.sets || [],
            setOrder: data.setOrder || data.sets.map((_, i) => i)
          });
        })
        .catch((err) => console.error('Failed to load workout:', err));
    }, [id]);

    const handleSetChange = <K extends keyof WorkoutSet>(
      index: number,
      field: K,
      value: WorkoutSet[K]
    ) => {
      const newSets = [...draft.sets!];
      newSets[index][field] = value;
      setSets(newSets);
    };

    const handleExerciseChange = <K extends keyof Exercise>(
      setIndex: number,
      exIndex: number,
      field: K,
      value: Exercise[K]
    ) => {
      const newSets = [...draft.sets!];
      newSets[setIndex].exercises[exIndex][field] = value;
      setSets(newSets);
    };

    const addSet = () => {
      console.log(draft);
      const newSet = { title: '', order: draft.sets!.length, exercises: [] };
      setSets([...draft.sets!, newSet]);
      setSetOrder([...draft.setOrder!, draft.sets!.length]);
    };

    const addExercise = (setIndex: number) => {
      const newSets = [...draft.sets!];
      newSets[setIndex].exercises.push({
        title: '',
        duration: 0,
        order: newSets[setIndex].exercises.length,
      });
      setSets(newSets);
    };

    const setOrderSummary = (() => {
      if (!draft.sets!.length || !draft.setOrder!.length) return '';

      const chunks: { index: number; count: number }[] = [];

      for (let i = 0; i < draft.setOrder!.length; i++) {
        const index = draft.setOrder![i];
        if (chunks.length && chunks[chunks.length - 1].index === index) {
          chunks[chunks.length - 1].count += 1;
        } else {
          chunks.push({ index, count: 1 });
        }
      }

      return chunks
        .map(({ index, count }) => {
          const label = draft.sets![index]?.title?.trim() || `Set ${index + 1}`;
          return count > 1 ? `${label} (x${count})` : label;
        })
        .join(' → ');
    })();

    const handleSaveEdit = async () => {
      const workoutToSave: Workout = {
        title: draft.title!,
        tags: draft.tags!,
        sets: draft.sets!,
        setOrder: draft.setOrder!
      };

      if(id) {
        await updateWorkout(id, workoutToSave)
          .then(() => {
            resetDraft();
            setIsEditorPanelOpen(false);
          })
          .catch(console.error);
      } else {
        await createWorkout(workoutToSave)
          .then(() => {
            resetDraft();
            setIsEditorPanelOpen(false);
          })
          .catch(console.error);
      }
    };

    const removeExercise = (setIndex: number, exIndex: number) => {
      const newSets = [...draft.sets!];
      newSets[setIndex].exercises.splice(exIndex, 1);
      setSets(newSets);
    };

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragStart = (event: DragStartEvent, setIndex: number) => {
      const { active } = event;
      const index = draft.sets![setIndex].exercises.findIndex((_, i) => i.toString() === active.id);
      if (index !== -1) {
        setActiveExercise(draft.sets![setIndex].exercises[index]);
      }
    };

    const handleDragEnd = (event: DragEndEvent, setIndex: number) => {
      const { active, over } = event;
      setActiveExercise(null);

      if (!over || active.id === over.id) return;

      const oldIndex = draft.sets![setIndex].exercises.findIndex((_, i) => i.toString() === active.id);
      const newIndex = draft.sets![setIndex].exercises.findIndex((_, i) => i.toString() === over.id);

      const newSets = [...draft.sets!];
      newSets[setIndex].exercises = arrayMove(newSets[setIndex].exercises, oldIndex, newIndex);
      setSets(newSets);
    };

    const toggleEdit = (setIndex: number, exIndex: number) => {
    const key = `${setIndex}-${exIndex}`;
    setEditingMap(prev => ({ ...prev, [key]: !prev[key] }));
  };


    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setIsEditorPanelOpen(false)} className="text-gray-500 hover:text-gray-800">
              &times; Close
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >{id ? ('Edit') : ('Save New')}
          </button>
      </div>

        {saveMessage && (
          <div className="text-sm text-green-700 bg-green-100 border border-green-300 rounded px-3 py-1 w-fit mb-2">
            {saveMessage}
          </div>
        )}
        
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-bold">{id ? 'Edit Workout' : 'Create Workout'}</h2>
          <input
            type="text"
            placeholder="Workout Title"
            className="input input-bordered w-full"
            value={draft.title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="input input-bordered w-full"
            value={draft.tags!.join(', ')}
            onChange={(e) => {setTags(e.target.value.split(',').map(t => t.trim()))} }
          />

          <div className="text-sm text-gray-600 italic">{setOrderSummary}</div>
        </div>

        <br/>

        <div className="flex overflow-x-auto gap-4 pb-4">
          {draft.sets!.map((set, setIndex) => (
            <div key={setIndex} className="min-w-[300px] max-w-[auto] flex-shrink-0 p-4 rounded shadow bg-gray-100">
              <input
                type="text"
                placeholder={`Title: Set ${setIndex + 1} (optional)`}
                className="input input-bordered w-full mb-2"
                value={set.title || ''}
                onChange={(e) => handleSetChange(setIndex, 'title', e.target.value)}
              />

              <h4 className="font-semibold">Exercises</h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={(e) => handleDragStart(e, setIndex)}
                onDragEnd={(event) => handleDragEnd(event, setIndex)}
              >
                <SortableContext items={set.exercises.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
                  {set.exercises.map((ex, exIndex) => (
                    <SortableExercise key={exIndex.toString()} id={exIndex.toString()}>
                    {({ attributes, listeners }) => {
                      const key = `${setIndex}-${exIndex}`;
                      const isEditing = editingMap[key] || false;
                      return (
                        <div key={exIndex} className="relative mb-4 bg-white p-3 rounded shadow space-y-2">
                          <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab text-gray-500 hover:text-gray-700 text-xl"
                            title="Drag To Reorder"
                          >
                            ☰
                          </button>
                          <button
                            onClick={() => removeExercise(setIndex, exIndex)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
                            title="Remove Exercise"
                          ><MdOutlineDeleteForever /></button>
                          <button
                            onClick={() => toggleEdit(setIndex, exIndex)}
                            className="absolute top-2 right-8 text-blue-500 text-sm hover:underline"
                            title={!isEditing ? "Edit Excersize" : "Save Excersize" }
                          >{!isEditing ? "Edit" : "Save" }</button>
                        

                          {!isEditing ? (
                            <>
                              <div className="font-semibold">{ex.title || 'Untitled Exercise'}</div>
                              <div className="flex justify-between items-center gap-2 text-xs text-gray-500">
                                <span>{ex.duration}s</span>
                                {ex.instructions && (
                                  <span className="truncate max-w-[200px]" title={ex.instructions}>
                                    {ex.instructions}
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label className="w-32 font-semibold text-sm">Title: </label>
                                <input
                                  type="text"
                                  className="input input-bordered flex-1"
                                  value={ex.title}
                                  onChange={(e) =>
                                    handleExerciseChange(setIndex, exIndex, 'title', e.target.value)
                                  }
                                  placeholder="e.g., Jumping Jacks"
                                />
                              </div>
                              <div>
                                <label className="w-32 font-semibold text-sm">Duration (s): </label>
                                <input
                                  type="number"
                                  className="input input-bordered w-auto max-w-[80px]"
                                  placeholder="e.g., 30"
                                  value={ex.duration}
                                  onChange={(e) =>
                                    handleExerciseChange(setIndex, exIndex, 'duration', parseInt(e.target.value))
                                  }
                                />
                              </div>
                              <div>
                                <label className="w-32 font-semibold text-sm">Instructions: </label>
                                <input
                                  type="text"
                                  className="input input-bordered flex-1"
                                  value={ex.instructions || ''}
                                  onChange={(e) =>
                                    handleExerciseChange(setIndex, exIndex, 'instructions', e.target.value)
                                  }
                                  placeholder="e.g., Keep back straight"
                                />
                              </div>
                            </>
                          )}
                      </div>
                    )}}
                    </SortableExercise>
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeExercise ? (
                    <div className="bg-white p-3 rounded shadow w-[280px] opacity-80">
                      <div className="font-semibold">{activeExercise.title || 'Untitled Exercise'}</div>
                      <div className="text-xs text-gray-500">{activeExercise.duration}s</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
              <button
                onClick={() => addExercise(setIndex)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                + Add Exercise
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addSet}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + Add WorkoutSet
        </button>
      </div>
    );
  };

  export default WorkoutEditor;
