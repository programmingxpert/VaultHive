
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User as UserIcon, Upload, Search, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                Neural <span className="text-indigo-600">Breach</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/browse" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
              <Search className="w-4 h-4" /> Browse
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all">
                  <Upload className="w-4 h-4" /> Upload
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2" />
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600">
                  <img src={user?.profilePicture || 'https://picsum.photos/200'} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                  <span>{user?.name.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 p-2 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-all">Join Platform</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 pb-4 px-4 space-y-1 animate-in slide-in-from-top duration-300">
          <Link to="/browse" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Browse Resources</Link>
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Upload Resource</Link>
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Profile Settings</Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50" onClick={() => setIsOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
