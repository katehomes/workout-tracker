
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutList from "./components/workout/WorkoutList";
import WorkoutEditor from "./components/workout/WorkoutEditor";
import WorkoutPlayer from './components/player/WorkoutPlayer';
import ExerciseList from './components/exercise/ExerciseList';
import ExerciseDetail from './components/exercise/ExerciseDetail';
import ExercisePage from './pages/ExercisePage';
import WorkoutPage from './pages/WorkoutPage';
import PlayerPage from './pages/PlayerPage';

const App = () => {
  console.log("App mounted");
  return (
    <Router>
      <Routes>
        <Route path="/workouts/" element={<WorkoutPage />} />
        <Route path="/player" element={<PlayerPage/>} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/exercises" element={<ExercisePage />} />
      </Routes>
    </Router>
  );
};

export default App;