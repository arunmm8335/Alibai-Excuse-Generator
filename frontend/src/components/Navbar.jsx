import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Globe, Sun, MoonStars, Palette, Sparkle, Lightning } from 'phosphor-react';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128';

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const { theme, themes, changeTheme } = useTheme();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  console.log('Navbar: Current theme is', theme);

  const handleThemeChange = (newTheme) => {
    console.log('Navbar: handleThemeChange called with', newTheme);
    changeTheme(newTheme);
    toast.success(`${themes.find(t => t.name === newTheme)?.label} theme activated!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success("Logged out successfully.");
    navigate('/');
  };

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-base-100 border-b border-base-300/40 shadow-lg min-h-[64px]">
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
          <li><Link to="/community">Community Wall</Link></li>
          {user && user.isModerator && (
            <li><Link to="/moderation">Moderation</Link></li>
          )}
          {isLoggedIn ? (
            <li><Link to="/profile">Profile</Link></li>
          ) : null}
          {!isLoggedIn && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>

        {/* Advanced Theme Selector */}
        <div className="dropdown dropdown-end ml-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Sparkle size={20} className="fill-current" />
          </label>

          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 z-50">
            {themes.map((themeOption) => {
              const IconComponent = themeOption.icon || Sparkle;
              return (
                <li key={themeOption.name}>
                  <button
                    onClick={() => handleThemeChange(themeOption.name)}
                    className={`flex items-center gap-3 p-3 hover:bg-base-300 transition-colors ${theme === themeOption.name ? 'bg-primary text-primary-content' : ''}`}
                  >
                    <IconComponent size={18} />
                    <span>{themeOption.label}</span>
                    {theme === themeOption.name && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Profile Avatar Dropdown */}
        {isLoggedIn && user && (
          <div className="dropdown dropdown-end ml-2">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 h-8 rounded-full ring-2 ring-primary/60 ring-offset-base-100 ring-offset-2 overflow-hidden flex items-center justify-center">
                <img src={user.profilePic || DEFAULT_AVATAR} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-44 z-50">
              <li>
                <Link to="/edit-profile">Edit Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;