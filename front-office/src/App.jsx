import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { ComplaintProvider } from './context/complaintContext';
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
import Restaurant from './pages/Restaurant';
import ReservationPage from './pages/ReservationPage';
import ReservationForm from './pages/ReservationForm';
import ComplaintForm from './pages/ComplaintForm';
import UserComplaints from './pages/UserComplaints';
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails';
import { ModalProvider } from './context/modalContext';
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
    // Normalize pathname by removing leading '/' and splitting
    const pathname = location.pathname.replace(/^\//, '').split('/')[0];
    setShowFooter(!hiddenNavbarRoutes.includes(pathname));
  }, [location.pathname]);

  return (
    <AuthProvider>
      <ModalProvider>
        <ComplaintProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/forgot-password"
                  element={<ResetPasswordEmail />}
                />
                <Route path="/verify-email" element={<VerifyCode />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route
                  path="/restaurants/:restaurantId"
                  element={<RestaurantDetails />}
                />
                <Route
                  path="/restaurants/:restaurantId/tables/:tableId/reserve"
                  element={
                    <ProtectedRoute>
                      <ReservationForm />
                    </ProtectedRoute>
                  }
                />

                {/* <Route
                path="/restaurants/:restaurantId"
                element={<ReservationPage />}
              /> */}
                <Route path="/complaint" element={<ComplaintForm />} />
                <Route
                  path="/my-complaints"
                  element={
                    <ProtectedRoute>
                      <UserComplaints />
                    </ProtectedRoute>
                  }
                />
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
            {showFooter && <Footer />}
          </div>
        </ComplaintProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
