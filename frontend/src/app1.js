// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importation des pages
import Dashboard from './dashboardEmploye/components/pages/Dashboard';
import MaterialRequestForm from './dashboardEmploye/components/pages/MaterialRequestForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nouvelle-demande" element={<MaterialRequestForm />} />
        {/* Route par défaut */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;