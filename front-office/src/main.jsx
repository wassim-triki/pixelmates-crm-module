import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from './context/authContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
    <AuthProvider> {/* Enveloppez l'application avec AuthProvider */}
      <App />
    </AuthProvider>
    </div>
  </BrowserRouter>
);