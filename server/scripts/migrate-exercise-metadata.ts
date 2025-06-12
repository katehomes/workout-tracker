import mongoose from 'mongoose';
import Exercise from '../models/Exercise';

async function migrateExercises() {
  await mongoose.connect('mongodb://localhost:27017/workouts');

  const exercises = await Exercise.find({});
  console.log(`Exercises: ${exercises.length}`);

  for (const exercise of exercises) {
    const newMetadata: typeof exercise.mediaMetadata = {
        demos:  ["0"],
        diagrams: ["2"],
        heros: ["1"]
    };

    exercise.mediaMetadata = newMetadata;

    // optional cleanup
    exercise.markModified('mediaMetadata');

    await exercise.save();
    console.log(`Migrated exercise: ${exercise.title}`);
  }

  console.log('✅ Migration complete.');
  await mongoose.disconnect();
}

migrateExercises().catch((err) => {
  console.error('❌ Migration failed:', err);
  mongoose.disconnect();
});
