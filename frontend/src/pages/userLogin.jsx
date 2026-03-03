import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loggin } from '../redux/userSlice';


export const UserLogin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [form, setForm] = useState({ email: '', password: '' });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/login', form);
        if (response.status === 200) {
          alert('Login successful');
          console.log(response.data)
          dispatch(loggin(response.data))
          navigate('/');
        }
      } catch (error) {
        alert('Invalid credentials');
        console.log('error:',error)
        
      }
    };
    
    return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">


      <form
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
    
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
    
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
    
        <button
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition duration-300"
          type="submit"
        >
          Login
        </button>
    
        <p className="text-center text-gray-600">
          Don’t have an account?{' '}
          <span
            className="text-purple-600 hover:underline cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </form>
    </div>  
    </>  
    );  
  };
  