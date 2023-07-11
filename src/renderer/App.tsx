import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/timer" element={<h1>Timer</h1>} />
      </Routes>
    </Router>
  );
}
