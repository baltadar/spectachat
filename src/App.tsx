import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { QuestionForm } from './components/QuestionForm';
import { SearchResults } from './pages/SearchResults';
import { AuthModal } from './components/AuthModal';
import { AdUnit } from './components/AdUnit';
import { Toast } from './components/Toast';

// New Toast component for notifications
function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}

function HomePage({ questions = [], loading = true }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Top banner ad */}
        <AdUnit slot="banner-top" className="mb-8" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Spectacles Knowledge Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ask questions, share experiences, and learn everything about prescription and non-prescription eyewear.
          </p>
          <Link
            to="/ask"
            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Ask a Question
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse Categories</h2>
          <CategoryList />
        </div>

        <div className="lg:flex lg:space-x-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Questions</h2>
                <Link
                  to="/questions"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View all
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading questions...
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No questions yet. Be the first to ask!
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id} className="border-b border-gray-200 last:border-0 pb-6">
                      <Link to={`/questions/${question.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {question.title}
                        </h3>
                        <p className="text-gray-600">{question.excerpt}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block w-[300px]">
            <AdUnit slot="sidebar" format="rectangle" className="sticky top-24" />
          </div>
        </div>
      </div>

      {/* Footer ad */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <AdUnit slot="footer" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions when component mounts
    fetchQuestions()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      });
  }, []);

  const handleAuthSuccess = (message) => {
    setIsAuthModalOpen(false);
    setToast({ visible: true, message });
  };

  const handleToastClose = () => {
    setToast({ visible: false, message: '' });
  };

  return (
    <Router>
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      
      <Routes>
        <Route path="/" element={<HomePage questions={questions} loading={loading} />} />
        <Route path="/ask" element={<QuestionForm onSuccess={() => {
          setToast({ visible: true, message: 'Question posted successfully!' });
          // Refresh questions
          fetchQuestions().then(data => setQuestions(data));
        }} />} />
        <Route path="/search" element={<SearchResults />} />
        {/* Add more routes as needed */}
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignupSuccess={() => handleAuthSuccess('You have successfully signed up. Please use your details to sign in.')}
        onSigninSuccess={() => handleAuthSuccess('Successfully signed in!')}
      />

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={handleToastClose}
      />
    </Router>
  );
}

export default App;
