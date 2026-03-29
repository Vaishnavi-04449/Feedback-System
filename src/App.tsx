import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login.tsx';
import GTMDashboard from './pages/GTMDashboard.tsx';
import CUDashboard from './pages/CUDashboard.tsx';

const PrivateRoute = ({ children, allowedRole }: { children: React.JSX.Element, allowedRole?: string }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/gtm/dashboard" element={
          <PrivateRoute allowedRole="GTM Manager">
            <GTMDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/cu/dashboard" element={
          <PrivateRoute allowedRole="CU Manager">
            <CUDashboard />
          </PrivateRoute>
        } />

        {/* Default route based on role */}
        <Route path="/" element={
          user ? (
            user.role === 'GTM Manager' ? <Navigate to="/gtm/dashboard" /> : <Navigate to="/cu/dashboard" />
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
};

export default App;
