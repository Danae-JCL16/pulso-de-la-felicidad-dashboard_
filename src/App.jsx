import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import HappinessProvider from "./components/HappinessProvider";
import Dashboard from "./components/Dashboard";
import MapaMundial from "./components/MapaMundial";
import VistaSocial from "./components/VistaSocial";

function App() {
  return (
    <HappinessProvider>
      <Router>
        <Routes>
          <Route path="/mapa" element={<MapaMundial />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/social" element={<VistaSocial />} />

        </Routes>
      </Router>
    </HappinessProvider>
  );
}

export default App;
