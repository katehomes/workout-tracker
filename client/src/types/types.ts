export interface Exercise {
  title: string;
  duration: number;
  order: number;
  instructions?: string;
  image?: string;
}

export interface WorkoutSet {
  title?: string;
  order: number;
  repeat?: number;
  exercises: Exercise[];
}

export interface Workout {
  _id?: string;
  title: string;
  tags?: string[];
  sets: WorkoutSet[];
  createdAt?: string;
  updatedAt?: string;
}
