import React, { useEffect, useState } from "react";
import type { Workout } from "../../types/types";
import { getWorkouts } from "../../api/workoutsApi";
import { RiPlayList2Fill, RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useWorkoutFilter } from "../../contexts/WorkoutFilterContext";
import { useWorkoutDraft } from "../../contexts/WorkoutDraftContext";

interface Props {
  onSelect: (id: string) => void;
  setEditorPanelOpen: (open: boolean) => void;
}

const WorkoutList: React.FC<Props> = ({ onSelect, setEditorPanelOpen }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { search, selectedTags } = useWorkoutFilter();
  const {selectedWorkoutId} = useWorkoutDraft();

  useEffect(() => {
    getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  const filtered = workouts.filter((wo) => {
    const titleMatch = wo.title.toLowerCase().includes(search.toLowerCase());
    const tagMatch = wo.tags.some(tag =>
      tag.toLowerCase().includes(search.toLowerCase())
    );

    const matchesSearch = !search || titleMatch || tagMatch;
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => wo.tags.includes(tag.toLowerCase()));

    return matchesSearch && matchesTags;
  });

  const handleDoubleClick = () => {
    setEditorPanelOpen(true);
  };

  const handleClickOpenEdit = (id: string) => {
    onSelect(id);
    setEditorPanelOpen(true);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workouts</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No workouts match your filters.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
          {...filtered.sort((a, b) => a.title.localeCompare(b.title)).map((workout) => {
            const previewImg = null; //TODO: add hero image

            const backgroundStyle = workout._id == selectedWorkoutId ? 'bg-blue-100 hover:bg-blue-50' : 'bg-white hover:bg-blue-50';

            return (
              <li
                key={workout._id}
                className={`flex justify-between border rounded shadow ${backgroundStyle} cursor-pointer transition`}
                onClick={() => onSelect(workout._id!)}
                onDoubleClick={handleDoubleClick}
              >
                {previewImg && (
                  <img
                    src={previewImg}
                    alt={workout.title}
                    className="w-24 h-24 object-cover rounded-l"
                  />
                )}
                <div className={`w-2 h-24 bg-blue-500 text-white`}></div>
                <div className="p-4 flex-1 flex-col justify-center">
                  <h3 className="text-md font-semibold capitalize line-clamp-1">{workout.title}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    {workout.tags.join(', ')}
                  </div>
                </div>
                <div className={`flex flex-col justify-evenly h-24 px-1`}>
                  <Link
                      to={`/player/${workout._id}`}
                      className="text-green-500 hover:underline"
                    >
                      <RiPlayList2Fill className="text-xl"/>
                    </Link>
                  <button
                    className="text-blue-500 hover:bg-blue-100 rounded"
                    onClick={() => handleClickOpenEdit(workout._id!)}
                  >
                    <RiEdit2Fill className="text-xl"/>
                  </button>
                  <button className="text-red-500 text-xl hover:underline"><RiDeleteBin2Fill /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WorkoutList;
