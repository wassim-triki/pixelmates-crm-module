import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      {/* This wraps everything and ensures footer stays at the bottom */}
      <App />
    </div>
  </BrowserRouter>
);
