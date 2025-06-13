import mongoose from 'mongoose';
const { Schema } = mongoose;

const WorkoutExerciseSchema = new Schema({
  exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
  order: { type: Number, required: true },
  duration: { type: Number, required: true },
  instructions: { type: String },
});

const SetSchema = new Schema({
  title: { type: String },
  order: { type: Number, required: true },
  exercises: { type: [WorkoutExerciseSchema], required: true },
});

const WorkoutSchema = new Schema({
  title: { type: String, required: true },
  tags: [String],
  sets: [SetSchema],
  setOrder: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Workout', WorkoutSchema);
