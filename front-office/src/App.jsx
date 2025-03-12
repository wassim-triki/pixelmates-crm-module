import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
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
import Footer from './components/footer';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyCode from './pages/VerifyCode';
import AboutUs from './pages/aboutUs';

const App = () => {
  const location = useLocation();
  const hiddenNavbarRoutes = ['signup', 'login'];

  return (
    <AuthProvider>
      {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
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
          path="/Settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              {/* <AdminDashboard /> */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute requiredRole="superadmin">
              {/* <SuperAdminPanel /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
    </AuthProvider>
  );
};

export default App;
