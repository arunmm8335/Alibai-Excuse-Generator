import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import BackgroundSelector from '../components/BackgroundSelector';

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
        navigate('/');
        return 'Account created successfully!';
      },
      error: (err) => err.response?.data?.msg || 'Registration failed. Please try again.',
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
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4 gradient-text">
              Join Alibai
            </h2>
            <p className="text-lg text-base-content/80">
              Start generating intelligent excuses in seconds.
            </p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-200/20 backdrop-blur-md p-8 shadow-2xl border border-base-300/30">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content/90 font-medium">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-colors"
                    required
                    onChange={onChange}
                    aria-label="Full Name"
                    tabIndex={0}
                  />
                </div>
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
                    placeholder="Password (min. 6 characters)"
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
                  aria-label="Create Account"
                  tabIndex={0}
                >
                  Create Account
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