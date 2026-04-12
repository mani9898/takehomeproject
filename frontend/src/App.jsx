import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/agency/:slug" element={<Dashboard />} />
        <Route path="/agency/:slug/event/:eventId" element={<EventDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
