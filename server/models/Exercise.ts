import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'gif', 'video'], required: true },
  caption: { type: String }
});

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  steps: [{ type: String }],
  media: [mediaSchema]
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);
