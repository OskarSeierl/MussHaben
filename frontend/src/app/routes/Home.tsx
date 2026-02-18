import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase.ts';
import '../../styles/Home.css';
import {useAuth} from "../../hooks/useAuth.ts";

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>Willhaben Advanced Search Agent</h1>
        <div className="user-section">
          {user && (
            <>
              <div className="user-info">
                {user.photoURL && <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />}
                <span className="user-name">{user.displayName || user.email}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <h2>Welcome!</h2>
        <p>You have successfully logged in.</p>

        {user && (
          <div className="user-details">
            <h3>Your Information</h3>
            <p><strong>Email:</strong> {user.email}</p>
            {user.displayName && <p><strong>Name:</strong> {user.displayName}</p>}
            {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
            <p><strong>UID:</strong> {user.uid}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

