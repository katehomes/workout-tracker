import React, { useEffect, useState } from "react";
import type { Workout } from "../types/types";
import { getWorkouts } from "../api/workouts";
import { Link } from "react-router-dom";

import { RiPlayList2Fill } from "react-icons/ri";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";

const WorkoutList: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    getWorkouts().then(setWorkouts).catch(console.error);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Link
        to="edit/"
        className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        + New Workout
      </Link>

      {workouts.map((workout) => (
        <div key={workout._id} className="bg-white rounded-lg shadow p-4">
          <div className="text-xl font-semibold">{workout.title}</div>
          <div className="flex flex-wrap mt-2 gap-2">
            {workout.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Link
              to={`/workouts/player/${workout._id}`}
              className="text-green-500 hover:underline"
            >
              <RiPlayList2Fill className="text-xl"/>
            </Link>
            <Link
              to={`/workouts/edit/${workout._id}`}
              className="text-blue-500 hover:underline"
            >
              <RiEdit2Fill className="text-xl"/>
            </Link>
            <button className="text-red-500 text-xl hover:underline"><RiDeleteBin2Fill /></button>
          </div>
        </div>
      ))}  
    </div>
  );
};

export default WorkoutList;
