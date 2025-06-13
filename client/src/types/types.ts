import type { Exercise } from "../api/exerciseApi";

export interface WorkoutExercise {
  exercise: string | Exercise;
  order: number;
  duration: number;
  instructions?: string;
}

export interface WorkoutSet {
  title?: string;
  order: number;
  exercises: WorkoutExercise[];
}

export interface Workout {
  _id?: string;
  title: string;
  tags: string[];
  sets: WorkoutSet[];
  setOrder: number[];
  createdAt?: string;
}
