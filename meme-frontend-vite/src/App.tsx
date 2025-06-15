import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/pages/register'
import Login from './pages/login';
import Home from './pages/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;