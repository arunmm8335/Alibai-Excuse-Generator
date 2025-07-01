import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Globe, Sun, MoonStars } from 'phosphor-react';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  // We explicitly check for 'light' theme. Any other value defaults to our dark 'aiStudio' theme.
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'aiStudio');

  useEffect(() => {
    const currentTheme = theme === 'light' ? 'light' : 'aiStudio';
    localStorage.setItem('theme', currentTheme);
    document.querySelector('html').setAttribute('data-theme', currentTheme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'aiStudio' : 'light';
    setTheme(newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success("Logged out successfully.");
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-200 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Alibai
          </span>
        </Link>
      </div>
      <div className="flex-none items-center">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isLoggedIn ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>

        {/* --- DEFINITIVE THEME TOGGLE FIX --- */}
        <label className="btn btn-ghost btn-circle swap swap-rotate ml-2">
          {/* This input now drives the swap component based on a simple true/false check */}
          <input 
            type="checkbox"
            onChange={handleThemeToggle}
            // The checkbox is "checked" ONLY when the theme is light.
            checked={theme === 'light'} 
          />
          
          {/* swap-on is shown when checked={true} (i.e., light theme is active) */}
          <Sun size={20} className="swap-on fill-current" />
          
          {/* swap-off is shown when checked={false} (i.e., aiStudio theme is active) */}
          <MoonStars size={20} className="swap-off fill-current" />
        </label>
      </div>
    </div>
  );
};

export default Navbar;