
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutList from "./components/WorkoutList";
import WorkoutEditor from "./components/WorkoutEditor";
import WorkoutPlayer from './components/player/WorkoutPlayer';

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
      </Routes>
    </Router>
  );
};

export default App;