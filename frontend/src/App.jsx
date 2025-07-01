import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Import the gatekeeper

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = !!localStorage.getItem('token');
    setIsLoggedIn(token);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100 font-sans">
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#2a323c', color: '#e5e7eb' }, }} />
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="flex-grow container mx-auto px-4 py-4">
        <Routes>
          {/* --- DEFINITIVE PROTECTED ROUTE --- */}
          {/* The '/' route is now wrapped by ProtectedRoute */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* The HomePage will only be rendered if the user is logged in */}
            <Route index element={<HomePage />} />
          </Route>
          
          {/* Publicly accessible routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;