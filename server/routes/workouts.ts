import express, { Request, Response } from 'express';
import Workout from '../models/Workout';

const router = express.Router();

// GET all workouts
router.get('/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find();
  res.json(workouts);
});

// GET one workout
router.get('/:id', async (req: Request, res: Response) => {
  const workout = await Workout.findById(req.params.id);
  res.json(workout);
});

// POST create workout
router.post('/', async (req: Request, res: Response) => {
  const workout = new Workout(req.body);
  await workout.save();
  res.status(201).json(workout);
});

// PUT update workout
router.put('/:id', async (req: Request, res: Response) => {
  const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE workout
router.delete('/:id', async (req: Request, res: Response) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
