import axios from 'axios';
import { Workout } from '../types/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/workouts';

export const getWorkouts = async (): Promise<Workout[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getWorkout = async (id: string): Promise<Workout> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createWorkout = async (workout: Workout): Promise<Workout> => {
  const res = await axios.post(API_URL, workout);
  return res.data;
};

export const updateWorkout = async (id: string, workout: Partial<Workout>): Promise<Workout> => {
  const res = await axios.put(`${API_URL}/${id}`, workout);
  return res.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
