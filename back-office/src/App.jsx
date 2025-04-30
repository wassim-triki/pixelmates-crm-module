import { Suspense, useEffect } from 'react';

import Index from './jsx';
import { useNavigate } from 'react-router-dom';

/// Style
import './assets/css/style.css';
import 'leaflet/dist/leaflet.css';

import { checkAuth } from './services/AuthService';
import { useAuth } from './context/authContext';
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
    }
    //  else {
    //   navigate('/login');
    // }
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
