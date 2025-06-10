// models/Exercise.ts
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'gif', 'video'], required: true },
  caption: { type: String },
  side: { type: String, enum: ['left', 'right', 'both'] },
});

const exerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: [String],
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], required: true },
    primaryMuscles: { type: [String], required: true },
    secondaryMuscles: [String],
    steps: [String],
    appliesTo: {type: String, enum: ['left', 'right', 'both']},
    media: [mediaSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Exercise', exerciseSchema);
