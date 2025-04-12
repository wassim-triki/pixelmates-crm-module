import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/unauthorized" replace />;

  return children; // Renders the child routes
};

export default ProtectedRoute;
