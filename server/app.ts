import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/workouts', workoutRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/workouts')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
