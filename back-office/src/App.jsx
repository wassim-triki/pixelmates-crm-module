import { lazy, Suspense, useEffect } from 'react';

/// Components
import Index from './jsx';
import { connect, useDispatch } from 'react-redux';
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
// action

import { isAuthenticated } from './store/selectors/AuthSelectors';
/// Style
import './assets/css/style.css';
import { checkAuth } from './services/AuthService';
import { useAuth } from './context/authContext';
import ProtectedRoute from './jsx/components/ProtectedRoute';
import Home from './jsx/components/Dashboard/Home';

// const SignUp = lazy(() => import('./jsx/pages/Registration'));
const ClientSignUp = lazy(() => import('./jsx/pages/ClientRegister'));
const RestaurantSignUp = lazy(() => import('./jsx/pages/RestaurantRegister'));
const ForgotPassword = lazy(() => import('./jsx/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./jsx/pages/ResetPassword'));
const Unauthorized = lazy(() => import('./jsx/pages/Unauthorized')); // Added Unauthorized import
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
  });
});

function App(props) {
  const { user, setUser } = useAuth();
  let navigate = useNavigate();
  useEffect(() => {
    checkAuth().then((user) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      switch (user?.role?.name) {
        case 'SuperAdmin':
          navigate('/superadmin/dashboard');
          break;
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        // case 'client':
        //   navigate('/client/dashboard');
        //   break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [user]);
  return (
    <>
      <Suspense
        fallback={
          <div id="preloader">
            <div className="sk-three-bounce">
              <div className="sk-child sk-bounce1"></div>
              <div className="sk-child sk-bounce2"></div>
              <div className="sk-child sk-bounce3"></div>
            </div>
          </div>
        }
      >
        <Index />
      </Suspense>
    </>
  );
}

export default App;
