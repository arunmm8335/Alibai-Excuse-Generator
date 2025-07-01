import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
    <div className="min-h-full flex items-center justify-center py-12 px-4 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-neutral">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral/70">
            Start generating intelligent excuses in seconds.
          </p>
        </div>

        {/* Form Card */}
        <form className="mt-8 space-y-6 card bg-base-200/50 p-8 shadow-xl glass" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                className="input input-bordered w-full" 
                required 
                onChange={onChange} 
              />
            </div>
            <div className="form-control pt-4">
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
                placeholder="Password (min. 6 characters)" 
                className="input input-bordered w-full" 
                required 
                onChange={onChange} 
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-neutral/70">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;