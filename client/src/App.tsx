
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutList from "./components/workout/WorkoutList";
import WorkoutEditor from "./components/workout/WorkoutEditor";
import WorkoutPlayer from './components/player/WorkoutPlayer';
import ExerciseList from './components/exercise/ExerciseList';
import ExerciseDetail from './components/exercise/ExerciseDetail';

const App = () => {
  console.log("App mounted");
  return (
    <Router>
      <Routes>
        <Route path="/workouts/" element={<WorkoutList />} />
        <Route path="/workouts/edit/:id" element={<WorkoutEditor />} />
        <Route path="/workouts/edit" element={<WorkoutEditor />} />
        <Route path="/workouts/player" element={<WorkoutPlayer />} />
        <Route path="/workouts/player/:id" element={<WorkoutPlayer />} />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
      </Routes>
    </Router>
  );
};

export default App;