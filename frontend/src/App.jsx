import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Import the gatekeeper
import api from './api';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CommunityWallPage from './pages/CommunityWallPage';
import ModeratorPanel from './pages/ModeratorPanel';
import WelcomePage from './pages/WelcomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      return;
    }
    try {
      const res = await api.get('/users/profile', { headers: { 'x-auth-token': token } });
      setUser(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100 font-sans dark-scrollbar">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--b2))',
            color: 'hsl(var(--bc))',
            border: '1px solid hsl(var(--b3))',
            borderRadius: '1rem',
          },
        }}
      />
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />

      <main className="flex-grow container mx-auto px-4 py-2">
        <Routes>
          {/* --- DEFINITIVE PROTECTED ROUTE --- */}
          {/* The '/' route is now wrapped by ProtectedRoute */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* The HomePage will only be rendered if the user is logged in */}
            <Route index element={<HomePage />} />
          </Route>

          {/* Publicly accessible routes */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/community" element={<CommunityWallPage />} />
          {user && user.isModerator && (
            <Route path="/moderation" element={<ModeratorPanel />} />
          )}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
