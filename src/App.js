import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import MachineDetail from './pages/MachineDetail';
import AddMachine from './pages/AddMachine';
import EditMachine from './pages/EditMachine';
import AddBreakdown from './pages/AddBreakdown';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import TeamManagement from './pages/TeamManagement';

import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading" style={{ marginTop: 120 }}>LOADING...</div>;
  return user ? children : <Navigate to="/signin" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading" style={{ marginTop: 120 }}>LOADING...</div>;
  return user ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Private routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/machine/:id" element={<PrivateRoute><MachineDetail /></PrivateRoute>} />
      <Route path="/machine/:id/edit" element={<PrivateRoute><EditMachine /></PrivateRoute>} />
      <Route path="/machine/:id/breakdown" element={<PrivateRoute><AddBreakdown /></PrivateRoute>} />
      <Route path="/add-machine" element={<PrivateRoute><AddMachine /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/team" element={<PrivateRoute><TeamManagement /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;