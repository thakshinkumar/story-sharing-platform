import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateStory from './pages/CreateStory';
import StoryDetail from './pages/StoryDetail';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
