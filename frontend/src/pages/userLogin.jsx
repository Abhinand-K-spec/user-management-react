import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loggin } from '../redux/userSlice';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, form);
      if (response.status === 200) {
        setSuccess('Login successful! Redirecting...');
        dispatch(loggin(response.data));
        setTimeout(() => navigate('/'), 800);
      }
    } catch (error) {
      setApiError('Invalid email or password.');
      console.log('error:', error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.2rem', color: '#4f46e5' }}>
            <i className="bi bi-person-circle"></i>
          </div>
          <h2 className="mt-2">Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        {apiError && <div className="alert-error mb-3">{apiError}</div>}
        {success && <div className="alert-success mb-3">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn-primary-custom">
            <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/register')}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};
