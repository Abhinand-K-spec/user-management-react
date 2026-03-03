import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [editApiError, setEditApiError] = useState('');

  // Add modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addErrors, setAddErrors] = useState({});
  const [addApiError, setAddApiError] = useState('');

  // Global messages
  const [deleteError, setDeleteError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => { fetchUsers(); }, [page]);

  /* ── API Helpers ───────────────────────────────── */
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const checkAuth = (status) => {
    if (status === 403) dispatch(logout());
  };

  const fetchUsers = async () => {
    setFetchError('');
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/users?page=${page}&limit=10`,
        authHeader()
      );
      setUsers(data.users);
      setTotalPages(data.pages || 1);
    } catch (error) {
      checkAuth(error.response?.status);
      setFetchError('Failed to load users. Please try again.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeleteError('');
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/delete/${id}`, authHeader());
      fetchUsers();
    } catch (error) {
      checkAuth(error.response?.status);
      setDeleteError('Failed to delete user. Please try again.');
    }
  };

  /* ── Edit ──────────────────────────────────────── */
  const openEdit = async (id) => {
    setEditErrors({});
    setEditApiError('');
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/user/${id}`,
        authHeader()
      );
      setEditName(data.user.name);
      setEditEmail(data.user.email);
      setSelectedId(id);
      setEditOpen(true);
    } catch (error) {
      checkAuth(error.response?.status);
      setEditApiError('Failed to load user details.');
      setEditOpen(true);
    }
  };

  const validateEdit = () => {
    const errs = {};
    if (!editName.trim()) errs.editName = 'Name is required.';
    if (!editEmail.trim()) {
      errs.editEmail = 'Email is required.';
    } else if (!validateEmail(editEmail)) {
      errs.editEmail = 'Enter a valid email address.';
    }
    return errs;
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditApiError('');
    const errs = validateEdit();
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/admin/edit/${selectedId}`,
        { name: editName, email: editEmail },
        authHeader()
      );
      setEditOpen(false);
      fetchUsers();
    } catch (error) {
      checkAuth(error.response?.status);
      setEditApiError(error.response?.data?.error || 'Failed to update user.');
    }
  };

  /* ── Add ───────────────────────────────────────── */
  const validateAdd = () => {
    const errs = {};
    if (!addName.trim()) errs.addName = 'Name is required.';
    if (!addEmail.trim()) {
      errs.addEmail = 'Email is required.';
    } else if (!validateEmail(addEmail)) {
      errs.addEmail = 'Enter a valid email address.';
    }
    if (!addPassword) {
      errs.addPassword = 'Password is required.';
    } else if (addPassword.length < 6) {
      errs.addPassword = 'Password must be at least 6 characters.';
    }
    return errs;
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setAddApiError('');
    const errs = validateAdd();
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/admin/create`,
        { name: addName, email: addEmail, password: addPassword },
        authHeader()
      );
      setAddOpen(false);
      setAddName(''); setAddEmail(''); setAddPassword('');
      fetchUsers();
    } catch (error) {
      checkAuth(error.response?.status);
      setAddApiError(error.response?.data?.error || 'Failed to create user.');
    }
  };

  /* ── Filtered list ─────────────────────────────── */
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  /* ── Render ────────────────────────────────────── */
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <i className="bi bi-people-fill me-2"></i>User Management
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button className="btn-add" onClick={() => { setAddOpen(true); setAddErrors({}); setAddApiError(''); setAddName(''); setAddEmail(''); setAddPassword(''); }}>
              <i className="bi bi-person-plus me-1"></i> Add User
            </button>
            <button className="btn-logout-sm" onClick={() => dispatch(logout())}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>

        {/* Global error messages */}
        {fetchError && <div className="alert-error mb-3">{fetchError}</div>}
        {deleteError && <div className="alert-error mb-3">{deleteError}</div>}

        {/* Search */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.2rem' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}></i>
                      No users found.
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => (
                  <tr key={u._id}>
                    <td style={{ color: '#94a3b8', width: '48px' }}>
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-edit me-2" onClick={() => openEdit(u._id)}>
                        <i className="bi bi-pencil-square me-1"></i> Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteUser(u._id)}>
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button className="btn-page" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <i className="bi bi-chevron-left"></i> Prev
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button className="btn-page" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Modal ─────────────────────────────── */}
      {editOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="modal-box">
            <h3><i className="bi bi-pencil-square me-2"></i>Edit User</h3>
            <button className="modal-close" onClick={() => setEditOpen(false)}>&times;</button>

            {editApiError && <div className="alert-error mb-3">{editApiError}</div>}

            <form onSubmit={submitEdit} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${editErrors.editName ? 'is-invalid' : ''}`}
                  placeholder="Enter name"
                  value={editName}
                  onChange={(e) => { setEditName(e.target.value); setEditErrors({ ...editErrors, editName: '' }); }}
                />
                {editErrors.editName && <div className="invalid-feedback">{editErrors.editName}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${editErrors.editEmail ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                  value={editEmail}
                  onChange={(e) => { setEditEmail(e.target.value); setEditErrors({ ...editErrors, editEmail: '' }); }}
                />
                {editErrors.editEmail && <div className="invalid-feedback">{editErrors.editEmail}</div>}
              </div>
              <button type="submit" className="btn-primary-custom">
                <i className="bi bi-check-lg me-2"></i>Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Modal ──────────────────────────────── */}
      {addOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}>
          <div className="modal-box">
            <h3><i className="bi bi-person-plus me-2"></i>Create New User</h3>
            <button className="modal-close" onClick={() => setAddOpen(false)}>&times;</button>

            {addApiError && <div className="alert-error mb-3">{addApiError}</div>}

            <form onSubmit={submitAdd} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className={`form-control ${addErrors.addName ? 'is-invalid' : ''}`}
                  placeholder="Enter name"
                  value={addName}
                  onChange={(e) => { setAddName(e.target.value); setAddErrors({ ...addErrors, addName: '' }); }}
                />
                {addErrors.addName && <div className="invalid-feedback">{addErrors.addName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${addErrors.addEmail ? 'is-invalid' : ''}`}
                  placeholder="Enter email"
                  value={addEmail}
                  onChange={(e) => { setAddEmail(e.target.value); setAddErrors({ ...addErrors, addEmail: '' }); }}
                />
                {addErrors.addEmail && <div className="invalid-feedback">{addErrors.addEmail}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${addErrors.addPassword ? 'is-invalid' : ''}`}
                  placeholder="Min. 6 characters"
                  value={addPassword}
                  onChange={(e) => { setAddPassword(e.target.value); setAddErrors({ ...addErrors, addPassword: '' }); }}
                />
                {addErrors.addPassword && <div className="invalid-feedback">{addErrors.addPassword}</div>}
              </div>
              <button type="submit" className="btn-primary-custom" style={{ backgroundColor: '#10b981' }}
                onMouseOver={e => e.target.style.backgroundColor = '#059669'}
                onMouseOut={e => e.target.style.backgroundColor = '#10b981'}>
                <i className="bi bi-person-check me-2"></i>Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};