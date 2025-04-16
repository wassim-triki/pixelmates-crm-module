import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext'; // ou AuthContext selon le nom exact du fichier
import HomePage from './pages/homePage';
import HomePageAfterLogin from './pages/homePageAfterLogin';
import Login from './pages/login';
import ResetPassword from './pages/resetPassword';
import Register from './pages/register';
import ResetPasswordEmail from './pages/resetPasswordEmail';
import ProfilePage from './pages/profilePage';
import EditProfile from './pages/editProfile';
import Settings from './pages/settingPage';
import Navbar from './components/navBar';
import NavbarAfterLogin from './components/navBarAfterLogin';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyCode from './pages/VerifyCode';
import AboutUs from './pages/aboutUs';
import OAuthCallback from './pages/OAuthCallback';
import Footer from './components/footer';
import Restaurant from './components/Restaurant';
import ReservationPage from './pages/ReservationPage';
import ReservationForm from "./pages/ReservationForm";


const App = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  const { user } = useAuth();

  const hiddenNavbarRoutes = [
    'login',
    'signup',
    'reset-password',
    'forgot-password',
    'verify-email',
  ];

  useEffect(() => {
    setShowFooter(!hiddenNavbarRoutes.includes(location.pathname));
  }, [location.pathname]);

  const renderNavbar = () => {
    if (user) {
      return <NavbarAfterLogin />;
    } else if (!hiddenNavbarRoutes.includes(location.pathname)) {
      return <Navbar />;
    }
    return null;
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {renderNavbar()}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home-page" element={<HomePageAfterLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ResetPasswordEmail />} />
            <Route path="/verify-email" element={<VerifyCode />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/reservation/:tableId" element={<ReservationForm />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin">{/* AdminDashboard */}</ProtectedRoute>} />
            <Route path="/superadmin" element={<ProtectedRoute requiredRole="superadmin">{/* SuperAdminPanel */}</ProtectedRoute>} />
          </Routes>
        </main>
        {showFooter && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
