import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/exercises';

export interface Media {
  _id?: string;
  url: string;
  type: 'image' | 'gif' | 'video';
  caption?: string;
  side?: 'left' | 'right' | 'both';
}

export interface Exercise {
  _id?: string;
  title: string;
  tags: string[];
  steps: string[];
  media: Media[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  primaryMuscles: string[];
  secondaryMuscles?: string[];
}

export const getAllExercises = async (): Promise<Exercise[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createExercise = async (exercise: Exercise): Promise<Exercise> => {
  const res = await axios.post(API_URL, exercise);
  return res.data;
};

export const updateExercise = async (id: string, exercise: Exercise): Promise<Exercise> => {
  const res = await axios.put(`${API_URL}/${id}`, exercise);
  return res.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
