import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DossierDetailPage from './pages/DossierDetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dossier/:number" element={<DossierDetailPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
