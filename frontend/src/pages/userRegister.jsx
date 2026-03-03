import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const UserRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', lastname: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'First name is required.';
    if (!form.lastname.trim()) newErrors.lastname = 'Last name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
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
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, form);
      if (response.status === 201) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setApiError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.2rem', color: '#4f46e5' }}>
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h2 className="mt-2">Create Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fill in your details below</p>
        </div>

        {apiError && <div className="alert-error mb-3">{apiError}</div>}
        {success && <div className="alert-success mb-3">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="form-label" htmlFor="reg-name">First Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="John"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-6">
              <label className="form-label" htmlFor="reg-lastname">Last Name</label>
              <input
                id="reg-lastname"
                type="text"
                name="lastname"
                className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                placeholder="Doe"
                value={form.lastname}
                onChange={handleChange}
              />
              {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn-primary-custom">
            <i className="bi bi-person-check me-2"></i> Register
          </button>
        </form>

        <p className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <span className="auth-link" onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};