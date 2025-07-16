import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import BackgroundSelector from '../components/BackgroundSelector';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const RegisterPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    const promise = axios.post('http://localhost:5000/api/auth/register', formData);

    toast.promise(promise, {
      loading: 'Creating your account...',
      success: (res) => {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        navigate('/welcome');
        return 'Account created successfully!';
      },
      error: (err) => err.response?.data?.msg || 'Registration failed. Please try again.',
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-[64px] px-2 md:px-4 py-2">
      {/* Background Image with Overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/20 to-accent/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Background Selector */}
      <BackgroundSelector onBackgroundChange={setBackgroundImage} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-2 md:px-4">
        <div className="max-w-md w-full space-y-8">

          {/* Header */}
          <div className="text-center flex flex-col items-center justify-center mb-2">
            <FaUserPlus className="mx-auto mb-2 text-primary drop-shadow-lg" size={56} aria-label="Register Icon" />
            <h2 className="text-5xl font-extrabold mb-2 text-primary drop-shadow-lg" style={{ letterSpacing: '0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.25)', color: 'var(--tw-prose-invert, #2563eb)' }}>
              Join Alibai
            </h2>
            <p className="text-lg text-base-content/80 mb-2">
              Start generating intelligent excuses in seconds.
            </p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-200/20 backdrop-blur-md p-6 md:p-8 shadow-2xl border border-base-300/30 w-full max-w-full">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Name</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xl z-10 pointer-events-none">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors pl-10"
                      required
                      onChange={onChange}
                      aria-label="Name"
                      tabIndex={0}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Email address</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xl z-10 pointer-events-none">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors pl-10"
                      required
                      onChange={onChange}
                      aria-label="Email address"
                      tabIndex={0}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xl z-10 pointer-events-none">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors pl-10"
                      required
                      onChange={onChange}
                      aria-label="Password"
                      tabIndex={0}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg font-semibold hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label="Sign Up"
                  tabIndex={0}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-base-content/80">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="Sign in"
              tabIndex={0}
            >
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;