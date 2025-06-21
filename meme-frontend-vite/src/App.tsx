import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../src/pages/register'
import Login from './pages/login';
import Home from './pages/home';
import Gallery from './pages/gallery';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;