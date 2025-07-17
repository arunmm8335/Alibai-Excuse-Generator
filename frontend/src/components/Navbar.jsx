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
    <nav className={`navbar fixed top-0 left-0 w-full z-50 bg-base-100/70 backdrop-blur-md border-b border-base-300/40 shadow-xl min-h-[64px] px-4 md:px-10 rounded-b-lg pb-0.5 ${theme === 'blackout' ? 'neon-navbar-border' : ''}`}
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-3xl font-extrabold tracking-tight px-2">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
            ExcuseMe
          </span>
        </Link>
      </div>
      <div className="flex-none items-center gap-2">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link to="/about" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">About</Link></li>
          <li><Link to="/contact" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Contact</Link></li>
          <li><Link to="/community" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Community Wall</Link></li>
          {user && user.isModerator && (
            <li><Link to="/moderation" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Moderation</Link></li>
          )}
          {isLoggedIn ? (
            <li><Link to="/profile" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Profile</Link></li>
          ) : null}
          {!isLoggedIn && (
            <>
              <li><Link to="/login" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Login</Link></li>
              <li><Link to="/register" className="rounded-xl px-3 py-2 font-medium hover:bg-primary/10 transition-colors">Register</Link></li>
            </>
          )}
        </ul>

        {/* Advanced Theme Selector */}
        <div className="dropdown dropdown-end ml-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle hover:bg-primary/10">
            <Sparkle size={22} className="fill-current" />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-200/90 rounded-2xl w-56 z-50 backdrop-blur-md" style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}>
            {themes.map((themeOption) => {
              const IconComponent = themeOption.icon || Sparkle;
              return (
                <li key={themeOption.name}>
                  <button
                    onClick={() => handleThemeChange(themeOption.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors ${theme === themeOption.name ? 'bg-primary text-primary-content' : ''}`}
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
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:bg-primary/10">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-all duration-200">
                <img src={user.profilePic || DEFAULT_AVATAR} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-200/90 rounded-2xl w-48 z-50 backdrop-blur-md" style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}>
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
    </nav>
  );
};

export default Navbar;