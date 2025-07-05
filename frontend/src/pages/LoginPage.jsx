import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import BackgroundSelector from '../components/BackgroundSelector';

const LoginPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const promise = axios.post('http://localhost:5000/api/auth/login', formData);

    toast.promise(promise, {
      loading: 'Logging in...',
      success: (res) => {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        navigate('/');
        return 'Welcome back!';
      },
      error: (err) => err.response?.data?.msg || 'Invalid credentials. Please try again.',
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Background Selector */}
      <BackgroundSelector onBackgroundChange={setBackgroundImage} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4 gradient-text">
              Welcome Back
            </h2>
            <p className="text-lg text-base-content/80">
              Access your excuse history and personalized suggestions.
            </p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-200/20 backdrop-blur-md p-8 shadow-2xl border border-base-300/30">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Email address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors"
                    required
                    onChange={onChange}
                    aria-label="Email address"
                    tabIndex={0}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors"
                    required
                    onChange={onChange}
                    aria-label="Password"
                    tabIndex={0}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg font-semibold hover:scale-105 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label="Sign In"
                  tabIndex={0}
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-base-content/80">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              aria-label="Create an account"
              tabIndex={0}
            >
              Create one here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;