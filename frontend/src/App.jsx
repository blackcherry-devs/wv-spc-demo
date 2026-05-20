import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import OperatorDashboard from './pages/OperatorDashboard.jsx';
import QRScanView from './pages/QRScanView.jsx';
import Header from './components/Header.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect to their appropriate dashboard
    return <Navigate to={user.role === 'ADMIN' ? '/' : '/operator'} replace />;
  }

  return children;
};

const AppLayout = ({ children, noPadding }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Header />
      <main className={`flex-grow relative ${noPadding ? '' : 'p-4 md:p-8'}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={user.role === 'ADMIN' ? '/' : '/operator'} replace /> : <Login />
        } />
        
        {/* QR Scan View - Unauthenticated/Guest Mode */}
        <Route path="/operacion/:id" element={<QRScanView />} />

        {/* Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout noPadding>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/operator/*" element={
          <ProtectedRoute allowedRoles={['OPERATOR']}>
            <AppLayout noPadding>
              <OperatorDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
