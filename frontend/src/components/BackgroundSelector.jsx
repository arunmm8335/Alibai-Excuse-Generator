import React, { useState } from 'react';
import { Image, Palette, Sparkle } from 'phosphor-react';

const BackgroundSelector = ({ onBackgroundChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const backgrounds = [
    {
      id: 'login-bg',
      name: 'Login Background',
      url: '/login-bg.jpg',
      description: 'Default login background'
    },
    {
      id: 'register-bg',
      name: 'Register Background',
      url: '/register-bg.jpg',
      description: 'Default register background'
    },
    {
      id: 'login-bg-alt',
      name: 'Login Alternative',
      url: '/login-bg-alt.jpg',
      description: 'Alternative login background'
    },
    {
      id: 'register-bg-alt',
      name: 'Register Alternative',
      url: '/register-bg-alt.jpg',
      description: 'Alternative register background'
    }
  ];

  const handleBackgroundSelect = (background) => {
    onBackgroundChange(background.url);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle absolute top-4 right-4 z-20"
        title="Change Background"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 z-30">
          <div className="card bg-base-200/90 backdrop-blur-md p-4 shadow-2xl border border-base-300/30 w-80">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkle size={20} className="text-primary" />
              Choose Background
            </h3>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handleBackgroundSelect(bg)}
                  className="group relative overflow-hidden rounded-lg border-2 border-base-300/30 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <div
                    className="w-full h-24 bg-cover bg-center"
                    style={{ backgroundImage: `url('${bg.url}')` }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                    <div className="text-xs font-semibold text-white">{bg.name}</div>
                    <div className="text-xs text-white/70">{bg.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundSelector; 