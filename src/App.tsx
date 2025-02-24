// App.js
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Toast } from './components/Toast';
import { useAuth } from './hooks/useAuth';

// Lazy loaded components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const QuestionForm = React.lazy(() => import('./components/QuestionForm'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const QuestionDetail = React.lazy(() => import('./pages/QuestionDetail'));

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header 
          user={user}
          isAuthenticated={isAuthenticated}
          onAuthClick={() => setIsAuthModalOpen(true)}
        />
        
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ask" element={<QuestionForm showToast={showToast} />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route 
                path="/profile" 
                element={
                  isAuthenticated ? 
                    <UserProfile /> : 
                    <Navigate to="/" replace />
                }
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <Suspense fallback={null}>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={(message) => {
              showToast(message);
              setIsAuthModalOpen(false);
            }}
          />
        </Suspense>

        {toast.show && (
          <Toast message={toast.message} type={toast.type} />
        )}
      </div>
    </Router>
  );
}

export default App;

// components/AuthModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signup(email, password);
        onSuccess('Successfully signed up! Please sign in with your new account.');
        setIsSignUp(false);
      } else {
        await login(email, password);
        onSuccess('Successfully signed in!');
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// components/Toast.jsx
export function Toast({ message, type = 'success' }) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  );
}

// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage or JWT)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token and get user data
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Implement login logic
    const response = await loginUser(email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const signup = async (email, password) => {
    // Implement signup logic
    const response = await signupUser(email, password);
    // Don't automatically log in after signup
    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
