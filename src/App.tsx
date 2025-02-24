import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { QuestionForm } from './components/QuestionForm';
import { SearchResults } from './pages/SearchResults';
import { AuthModal } from './components/AuthModal';
import { AdUnit } from './components/AdUnit';

function HomePage() {
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
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse Categories</h2>
          <CategoryList />
        </div>

        {/* Sidebar ad */}
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
              {/* Question list will be added here */}
              <div className="text-center text-gray-500 py-8">
                Loading questions...
              </div>
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
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  return (
    <Router>
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ask" element={<QuestionForm />} />
        <Route path="/search" element={<SearchResults />} />
        {/* Other routes will be added here */}
      </Routes>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </Router>
  );
}

export default App;