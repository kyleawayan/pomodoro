import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Timer from './Timer';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </Router>
  );
}
