import { Request, Response } from 'express';
import Workout from '../models/Workout';

// GET /workouts
export const getAllWorkouts = async (req: Request, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /workouts/:id
export const getWorkoutById = async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) res.status(404).json({ error: 'Not found' }); return
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /workouts
export const createWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', details: err });
  }
};

// PUT /workouts/:id
export const updateWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) res.status(404).json({ error: 'Not found' }); return;
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// DELETE /workouts/:id
export const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const removed = await Workout.findByIdAndDelete(req.params.id);
    if (!removed) res.status(404).json({ error: 'Not found' }); return;
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
