import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import "./css/ForgotPassword.css";
import "./css/Global.css";
import "./css/Dashboard.css";
import "./css/Sidebar.css";
import "./css/Navbar.css";
import "./css/Jobs.css";
import "./css/Profile.css";
import "./css/Forms.css";
import "./css/Login.css";
import "./css/Register.css";
import "./css/Responsive.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);