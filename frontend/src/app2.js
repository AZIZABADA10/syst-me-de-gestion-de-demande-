// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importation des pages
import Dashboard from './dashboardVlidateur/components/pages/Dashboard';
import MaterialListe from './dashboardVlidateur/components/pages/MaterialListe';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nouvelle-demande" element={<MaterialListe />} />
        {/* Route par défaut */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;