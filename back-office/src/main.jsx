import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ThemeContext from './context/ThemeContext.jsx';
import { AuthProvider } from './context/authContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter basename="/">
          <ThemeContext>
            <App />
          </ThemeContext>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
