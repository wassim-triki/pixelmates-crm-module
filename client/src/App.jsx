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
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';
/// Style

import './assets/css/style.css';

// const SignUp = lazy(() => import('./jsx/pages/Registration'));
const ClientSignUp = lazy(() => import('./jsx/pages/ClientRegister'));
const RestaurantSignUp = lazy(() => import('./jsx/pages/RestaurantRegister'));
const ForgotPassword = lazy(() => import('./jsx/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./jsx/pages/ResetPassword'));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
  });
});

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

function App(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    checkAutoLogin(dispatch, navigate);
  }, []);

  let routeblog = (
    <Routes>
      <Route
        element={
          <>
            <nav className="px-4 py-2 bg-white  shadow-sm flex ml-auto justify-center mb-5">
              <Link className="text-primary" to="/restaurant/register">
                For restaurants
              </Link>
            </nav>
            <Outlet />
          </>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/client/register" element={<ClientSignUp />} />
        <Route path="/restaurant/register" element={<RestaurantSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
  if (props.isAuthenticated) {
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
  } else {
    return (
      <div className="vh-100">
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
          {routeblog}
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

//export default connect((mapStateToProps)(App));
export default withRouter(connect(mapStateToProps)(App));
