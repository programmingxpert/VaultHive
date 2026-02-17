
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import Upload from './pages/Upload';
import Leaderboard from './pages/Leaderboard';
import ResourceDetail from './pages/ResourceDetail';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading session...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <PublicOnlyRoute>
              <Landing />
            </PublicOnlyRoute>
          } />
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          } />
          <Route path="/browse" element={<Browse />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rotate-45" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white">VaultHive 2026</span>
            </div>
            <p className="text-slate-400 text-sm">© 2024 Built by Team Overclocked for Yugastr Hackathon.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm font-medium">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm font-medium">Terms</a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-sm font-medium">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
