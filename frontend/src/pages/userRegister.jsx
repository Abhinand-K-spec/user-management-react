import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', lastname: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/register', form);
      if (response.status === 201) {
        alert('Registered Successfully');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Register</h2>

        {error && (
          <div className="text-red-500 text-center" role="alert">
            {error}
          </div>
        )}

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="lastname"
          placeholder="Lastname"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none text-black focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition duration-300"
        >
          Register
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};