
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkoutList from "./components/WorkoutList";
import WorkoutEditor from "./components/WorkoutEditor";

const App = () => {
  console.log("App mounted");
  return (
    <Router>
      <Routes>
        <Route path="/workouts/" element={<WorkoutList />} />
        <Route path="/workouts/edit/:id" element={<WorkoutEditor />} />
        <Route path="/workouts/edit" element={<WorkoutEditor />} />
      </Routes>
    </Router>
  );
};

export default App;