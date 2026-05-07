import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { isAuthenticated } from './services/api.js';

function RutaProtegida({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function RutaPublica({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/" replace />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RutaPublica>
              <LoginPage />
            </RutaPublica>
          }
        />
        <Route
          path="/"
          element={
            <RutaProtegida>
              <App />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
