import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MachineDetail from './pages/MachineDetail';
import AddMachine from './pages/AddMachine';
import AddBreakdown from './pages/AddBreakdown';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/machine/:id" element={<MachineDetail />} />
          <Route path="/add-machine" element={<AddMachine />} />
          <Route path="/machine/:id/breakdown" element={<AddBreakdown />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;