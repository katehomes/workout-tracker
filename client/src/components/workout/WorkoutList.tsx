import React, { useEffect, useState } from "react";
import type { Workout } from "../../types/types";
import { getWorkouts } from "../../api/workoutsApi";
import { RiPlayList2Fill, RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

interface Props {
  onSelect: (id: string) => void;
  setEditorPanelOpen: (open: boolean) => void;
}

const WorkoutList: React.FC<Props> = ({ onSelect, setEditorPanelOpen }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  const handleDoubleClick = () => {
    setEditorPanelOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workouts</h2>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="flex border rounded shadow bg-white cursor-pointer hover:bg-gray-50 transition"
            onClick={() => onSelect(workout._id!)}
            onDoubleClick={handleDoubleClick}
          >
            <div className="w-2 h-24 bg-blue-400" />
            <div className="p-4 flex flex-col justify-center flex-grow">
              <h3 className="text-md font-semibold capitalize">{workout.title}</h3>
              <div className="text-xs text-gray-500 mt-1">
                {workout.tags?.join(', ')}
              </div>
              <div className="flex gap-2 mt-2">
                <Link
                  to={`/workouts/player/${workout._id}`}
                  className="text-green-500 hover:text-green-700"
                >
                  <RiPlayList2Fill />
                </Link>
                <Link
                  to={`/workouts/edit/${workout._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <RiEdit2Fill />
                </Link>
                <button className="text-red-500 hover:text-red-700">
                  <RiDeleteBin2Fill />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;
