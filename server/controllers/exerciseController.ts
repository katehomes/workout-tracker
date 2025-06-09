import { Request, Response } from 'express';
import Exercise from '../models/Exercise';

// GET /exercises
export const getAllExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /exercises/:id
export const getExerciseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) res.status(404).json({ error: 'Not found' }); return
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /exercises
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    res.status(400).json({ error: 'Bad request', details: err });
  }
};

// PUT /exercises/:id
export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) res.status(404).json({ error: 'Not found' }); return;
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
};

// DELETE /exercises/:id
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const removed = await Exercise.findByIdAndDelete(req.params.id);
    if (!removed) res.status(404).json({ error: 'Not found' }); return;
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
