import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage     from './pages/AuthPage';
import CitizenDash  from './pages/CitizenDash';
import AdminDash    from './pages/AdminDash';

function ProtectedRoute({ children, role }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: { background:'#1a2332', color:'#e2e8f0', border:'1px solid #1e2d42' }
      }}/>
      <Routes>
        <Route path="/"        element={<AuthPage />} />
        <Route path="/citizen" element={<ProtectedRoute role="citizen"><CitizenDash /></ProtectedRoute>} />
        <Route path="/admin"   element={<ProtectedRoute role="admin"><AdminDash /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}
