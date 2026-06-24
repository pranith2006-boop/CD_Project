import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Compiler from './pages/Compiler';
import Documentation from './pages/Documentation';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;



