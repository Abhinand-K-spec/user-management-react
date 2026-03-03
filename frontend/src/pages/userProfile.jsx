import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username, id, email, token } = useSelector((state) => state.user);

  const [refresh, setRefresh] = useState(true);
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getUser = async () => {
      setApiError('');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setImage(response.data.user.profileImage);
      } catch (error) {
        if (error.response?.status === 403) dispatch(logout());
        setApiError('Failed to load profile. Please refresh.');
      }
    };
    getUser();
  }, [id, refresh]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFileError('');
    setSuccess('');
    if (!selected) return;
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError('Only JPG, PNG, WebP or GIF images are allowed.');
      setFile(null);
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setFileError('Image must be smaller than 2 MB.');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    if (!file) {
      setFileError('Please select an image file to upload.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', file);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/profile/upload/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Profile picture updated successfully!');
      setFile(null);
      setRefresh(!refresh);
    } catch (error) {
      if (error.response?.status === 403) {
        dispatch(logout());
        navigate('/login');
      }
      setApiError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <i className="bi bi-arrow-left"></i> Back to Home
          </button>
        </div>
        <h2><i className="bi bi-person-circle me-2"></i>My Profile</h2>

        {apiError && <div className="alert-error mb-3">{apiError}</div>}
        {success && <div className="alert-success mb-3">{success}</div>}

        {/* Avatar */}
        {image ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${image}`}
            alt="Profile"
            className="profile-img"
          />
        ) : (
          <div className="profile-avatar-placeholder">
            <i className="bi bi-person-fill"></i>
          </div>
        )}

        {/* User Info */}
        <div className="profile-info mb-4">
          <p><span>Name:</span> {username}</p>
          <p><span>Email:</span> {email}</p>
        </div>

        <hr style={{ borderColor: '#e2e8f0', marginBottom: '1.2rem' }} />

        {/* Upload Form */}
        <form onSubmit={handleUpload} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="profile-upload">
              Choose a new profile picture
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className={`form-control ${fileError ? 'is-invalid' : ''}`}
              onChange={handleFileChange}
            />
            {fileError && <div className="invalid-feedback">{fileError}</div>}
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.3rem' }}>
              JPG, PNG, WebP or GIF · Max 2 MB
            </div>
          </div>

          <button type="submit" className="btn-primary-custom">
            <i className="bi bi-cloud-upload me-2"></i> Upload Photo
          </button>
        </form>

        <button
          className="btn-danger-custom mt-3"
          onClick={() => { dispatch(logout()); navigate('/login'); }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
};
