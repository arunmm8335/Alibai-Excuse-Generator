import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    <div className="min-h-full flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-neutral">
            Login to Alibai
          </h2>
          <p className="mt-2 text-center text-sm text-neutral/70">
            Access your excuse history and personalized suggestions.
          </p>
        </div>

        {/* Form Card */}
        <form className="mt-8 space-y-6 card bg-base-200/50 p-8 shadow-xl glass" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email address</span>
              </label>
              <input 
                type="email" 
                name="email" 
                placeholder="email@example.com" 
                className="input input-bordered w-full" 
                required 
                onChange={onChange} 
              />
            </div>
            <div className="form-control pt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                className="input input-bordered w-full" 
                required 
                onChange={onChange} 
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-neutral/70">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary/80">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;