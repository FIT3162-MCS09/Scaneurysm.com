import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Scan from './pages/Scan';
import './App.css'; // Import the CSS file

const App: React.FC = () => {
  return (
      <Router>
        <div className="app">
          <Header />
          <div className="container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/" element={<Login />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
  );
};

export default App;