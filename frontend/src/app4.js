import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import AdminDashboard from './dashadmin';

// Configuration de base d'axios (URL de base, intercepteurs, etc.)
axios.defaults.baseURL = 'http://localhost:8000/api'; // Remplacez par votre URL Laravel
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<LoginPage />} /> {/* Page de connexion à implémenter */}
        </Routes>
      </div>
    </Router>
  );
}

// Page de connexion basique (à personnaliser)
function LoginPage() {
  const handleLogin = () => {
    // Ici, vous implémenteriez la logique de connexion
    // Après une connexion réussie, redirigez vers /admin
    window.location.href = '/admin';
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Connexion</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input type="password" className="form-control" id="password" />
          </div>
          <button 
            type="button" 
            className="btn btn-primary w-100"
            onClick={handleLogin}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

// Rendu de l'application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;