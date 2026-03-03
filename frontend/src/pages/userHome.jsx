import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export const UserHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, email, id, token } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfileImage(data.user?.profileImage || '');
      } catch (error) {
        if (error.response?.status === 403) dispatch(logout());
      }
    };
    if (id && token) fetchProfile();
  }, [id, token]);

  return (
    <div className="home-wrapper">
      <div className="home-card">

        {profileImage ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${profileImage}`}
            alt="Profile"
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #e0e7ff',
              display: 'block',
              margin: '0 auto 1rem',
            }}
          />
        ) : (
          <div className="home-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
        )}

        <div className="home-name">{username || 'User'}</div>
        <div className="home-email">{email || ''}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn-primary-custom"
            onClick={() => navigate(`/profile/${id}`)}
          >
            <i className="bi bi-person-badge me-2"></i> My Profile
          </button>

          <button
            className="btn-danger-custom"
            onClick={() => dispatch(logout())}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
