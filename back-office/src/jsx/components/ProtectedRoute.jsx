import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div id="preloader">
        <div className="sk-three-bounce">
          <div className="sk-child sk-bounce1"></div>
          <div className="sk-child sk-bounce2"></div>
          <div className="sk-child sk-bounce3"></div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role.name !== requiredRole)
    return <Navigate to="/unauthorized" replace />;

  return children; // Renders the child routes
};

export default ProtectedRoute;
