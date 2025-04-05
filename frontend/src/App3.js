// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importation des pages
import Dashboard from "./dashboardAdministaratif/components/pages/Dashboard";
import EmployeeManagement from "./dashboardAdministaratif/components/pages/EmployeeManagement";
import Demandes from "./dashboardAdministaratif/components/pages/Demandes";
import Stocks from "./dashboardAdministaratif/components/pages/Stocks";
import { ContextProvider } from "./ContextProvider";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
        <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
            <Route path="/Demandes" element={<Demandes />} />
            <Route path="/stock" element={<Stocks />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
