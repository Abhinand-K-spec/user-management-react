import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';

export const AdminDashboard = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const check = (s) => {
    if (s === '403') {
      dispatch(logout());
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]); 

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/admin/users?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.users);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      check(error.response?.status);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      check(error.response?.status);
      alert('Failed to delete user.');
    }
  };

  const getUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(response.data.user.name);
      setEmail(response.data.user.email);
      setSelectedUserId(id);
      setEditError('');
      setOpen(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      check(error.response?.status);
      alert('Failed to fetch user details.');
    }
  };

  const editUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/edit/${id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpen(false);
      setEditError('');
      fetchUsers();
    } catch (error) {
      console.error('Failed to edit user:', error);
      check(error.response?.status);
      setEditError(error.response?.data?.error || 'Failed to edit user.');
    }
  };

  const createUser = async () => {
    try {
      await axios.post(
        `http://localhost:3000/admin/create`,
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddOpen(false);
      setAddError('');
      setName('');
      setEmail('');
      setPassword('');
      fetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      check(error.response?.status);
      setAddError(error.response?.data?.error || 'Failed to create user.');
    }
  };

  const search = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      {/* Search and Add */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setAddOpen(true);
            setAddError('');
            setName('');
            setEmail('');
            setPassword('');
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Add
        </button>
      </div>

      {/* User Table */}
      <div className="max-w-4xl mx-auto mt-10 overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {search.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">{u.name}</td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6 text-center space-x-2">
                  <button
                    onClick={() => getUser(u._id)}
                    className="bg-yellow-400 text-white px-4 py-1 rounded-md hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            {editError && (
              <div className="text-red-500 text-center mb-4" role="alert">
                {editError}
              </div>
            )}
            <button
              onClick={() => {
                setOpen(false);
                setEditError('');
              }}
              className="absolute top-2 right-3 text-gray-600 text-xl"
            >
              ×
            </button>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={() => editUser(selectedUserId)}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 relative">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            {addError && (
              <div className="text-red-500 text-center mb-4" role="alert">
                {addError}
              </div>
            )}
            <button
              onClick={() => {
                setAddOpen(false);
                setAddError('');
              }}
              className="absolute top-2 right-3 text-gray-600 text-xl"
            >
              ×
            </button>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={createUser}
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={() => dispatch(logout())}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};