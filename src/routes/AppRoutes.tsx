import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage';
import RoundsListPage from '../pages/RoundsListPage';
import RoundPage from '../pages/RoundPage';
import type { RootState } from '../store';
import Header from '../components/Header';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes: React.FC = () => {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<ProtectedRoute><RoundsListPage /></ProtectedRoute>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/rounds" element={<ProtectedRoute><RoundsListPage /></ProtectedRoute>} />
      <Route path="/round/:id" element={<ProtectedRoute><RoundPage /></ProtectedRoute>} />
    </Routes>
    </>
  );
};

export default AppRoutes;