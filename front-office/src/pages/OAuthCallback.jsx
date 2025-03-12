import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      fetchUser(); // Fetch user details
      navigate('/profile'); // Redirect to profile after successful login
    } else {
      navigate('/login'); // Redirect to login if there's an issue
    }
  }, [navigate, fetchUser]);

  return <p>Signing in...</p>; // Temporary loading message
}

export default OAuthCallback;
