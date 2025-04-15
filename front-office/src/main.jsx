import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        {' '}
        {/* Enveloppez l'application avec AuthProvider */}
        <ToastContainer position="top-right" autoClose={3000} />
        <App />
      </AuthProvider>
    </div>
  </BrowserRouter>
);
