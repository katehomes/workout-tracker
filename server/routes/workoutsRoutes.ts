import express from 'express';
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController';

const router = express.Router();

router.get('/', getAllWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
