import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/homePage';
import Login from './pages/login';
import ResetPassword from './pages/resetPassword';
import Register from './pages/register';
import ResetPasswordEmail from './pages/resetPasswordEmail';
import ProfilePage from './pages/profilePage';
import EditProfile from './pages/editProfile';
import Settings from './pages/settingPage';
import Navbar from './components/navBar';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyCode from './pages/VerifyCode';
import AboutUs from './pages/aboutUs';
import OAuthCallback from './pages/OAuthCallback';
import Footer from './components/footer';

const App = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  // List of routes where the Navbar and Footer should be hidden
  const hiddenNavbarRoutes = [
    'login',
    'signup',
    'reset-password',
    'forgot-password',
    'verify-email',
  ];

  useEffect(() => {
    // If the current location is one of the hidden routes, hide the footer
    setShowFooter(!hiddenNavbarRoutes.includes(location.pathname));
  }, [location.pathname]);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Conditionally render Navbar based on the route */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar />}

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ResetPasswordEmail />} />
            <Route path="/verify-email" element={<VerifyCode />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            {/* Admin and Superadmin Routes with Role Protection */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  {/* AdminDashboard */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute requiredRole="superadmin">
                  {/* SuperAdminPanel */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Conditionally render Footer based on the route */}
        {showFooter && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
