import mongoose from 'mongoose';

export interface IExercise {
  title: string;
  duration: number;
  image?: string;
  instructions?: string;
  order: number;
}

export interface ISet {
  title?: string;
  repeat?: number;
  exercises: IExercise[];
  order: number;
}

export interface IWorkout extends mongoose.Document {
  title: string;
  tags: string[];
  sets: ISet[];
  createdAt?: Date;
}

const ExerciseSchema = new mongoose.Schema<IExercise>({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  image: String,
  instructions: String,
  order: { type: Number, required: true },
});

const SetSchema = new mongoose.Schema<ISet>({
  title: { type: String },
  repeat: { type: Number, default: 1 },
  exercises: [ExerciseSchema],
  order: { type: Number, required: true },
});

const WorkoutSchema = new mongoose.Schema<IWorkout>({
  title: { type: String, required: true },
  tags: [String],
  sets: [SetSchema],
  createdAt: { type: Date, default: Date.now },
});

const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
