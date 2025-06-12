import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IWorkout extends mongoose.Document {
  title: string;
  tags: string[];
  sets: {
    title?: string;
    exercises: mongoose.Types.ObjectId[]; // reference IDs
    order: number;
  }[];
  setOrder: number[];
  createdAt?: Date;
}

const SetSchema = new Schema({
  title: { type: String },
  exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise', required: true }],
  order: { type: Number, required: true },
});

const WorkoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  tags: [String],
  sets: [SetSchema],
  setOrder: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);
export default Workout;
