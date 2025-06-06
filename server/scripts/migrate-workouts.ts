import mongoose from 'mongoose';
import Workout from '../models/Workout';

async function migrateWorkouts() {
  await mongoose.connect('mongodb://localhost:27017/workouts');

  const workouts = await Workout.find({});
  console.log(`Workouts: ${workouts.length}`);

  for (const workout of workouts) {
    const originalSets = workout.sets || [];
    const newSets = [];
    const newSetOrder: number[] = [];

    let newIndex = 0;

    for (const set of originalSets) {
      const repeat = 'repeat' in set ? (set as any).repeat || 1 : 1;
      const { repeat: _, ...rest } = set as any;
      const baseSet = {
        ...rest,
        order: newIndex,
      };

      newSets.push(baseSet);
      for (let i = 0; i < repeat; i++) {
        newSetOrder.push(newIndex);
      }

      newIndex++;
    }

    workout.sets = newSets;
    workout.setOrder = newSetOrder;

    // optional cleanup
    workout.markModified('sets');
    workout.markModified('setOrder');

    await workout.save();
    console.log(`Migrated workout: ${workout.title}`);
  }

  console.log('✅ Migration complete.');
  await mongoose.disconnect();
}

migrateWorkouts().catch((err) => {
  console.error('❌ Migration failed:', err);
  mongoose.disconnect();
});
