import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext'; // Import du contexte
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

const App = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);

  // Utilisation du contexte d'authentification
  const { user } = useAuth(); // Accédez à l'utilisateur dans le contexte via useAuth()

  // Liste des routes où la Navbar et Footer sont masqués
  const hiddenNavbarRoutes = [
    'login',
    'signup',
    'reset-password',
    'forgot-password',
    'verify-email',
  ];

  useEffect(() => {
    // Si la route actuelle est dans la liste des routes cachées, cacher le footer
    setShowFooter(!hiddenNavbarRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Mise à jour conditionnelle de la Navbar après connexion
  const renderNavbar = () => {
    // Si l'utilisateur est connecté, afficher NavbarAfterLogin
    // Sinon afficher Navbar
    if (user) {
      return <NavbarAfterLogin />;
    } else if (!hiddenNavbarRoutes.includes(location.pathname)) {
      return <Navbar />;
    }
    return null; // Si la route est dans la liste des routes cachées, ne pas afficher de navbar
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Rendre conditionnellement Navbar */}
        {renderNavbar()}

        {/* Contenu principal */}
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
            {/* Routes pour l'admin et le superadmin avec protection de rôle */}
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

        {/* Footer conditionnel basé sur la route */}
        {showFooter && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
