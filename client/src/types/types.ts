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
  exercises: Exercise[];
}

export interface Workout {
  _id?: string;
  title: string;
  tags: string[];
  sets: WorkoutSet[];
  setOrder: number[];
  createdAt?: string;
  updatedAt?: string;
}

type Media = {
  url: string;
  type: 'image' | 'gif' | 'video';
  caption?: string;
}

