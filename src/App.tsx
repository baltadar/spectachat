import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { QuestionForm } from './components/QuestionForm';
import { SearchResults } from './pages/SearchResults';
import { AuthModal } from './components/AuthModal';
import { AdUnit } from './components/AdUnit';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { useQuestions } from './hooks/useQuestions';

// New components
const QuestionDetails = React.lazy(() => import('./pages/QuestionDetails'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function HomePage() {
  const { questions, isLoading, error } = useQuestions();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Show newsletter modal after 30 seconds if not subscribed
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSubscribed = localStorage.getItem('newsletterSubscribed');
      if (!hasSubscribed) {
        setShowNewsletterModal(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const filteredQuestions = questions?.filter(q => 
    selectedCategory === 'all' || q.category === selectedCategory
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Your Spectacles Knowledge Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Ask questions, share experiences, and learn everything about prescription 
              and non-prescription eyewear from our community of experts.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/ask"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Ask a Question
              </Link>
              <Link
                to="/categories"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
              >
                Browse Topics
              </Link>
            </div>
          </section>

          {/* Featured Content */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Categories</h2>
            <CategoryList 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </section>

          {/* Main Content Area */}
          <div className="lg:flex lg:space-x-8">
            <div className="flex-1">
              {/* Questions Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Recent Questions</h2>
                  <div className="flex items-center gap-4">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="rounded-md border-gray-300"
                    >
                      <option value="all">All Categories</option>
                      <option value="prescription">Prescription</option>
                      <option value="sunglasses">Sunglasses</option>
                      <option value="contact-lenses">Contact Lenses</option>
                      <option value="eye-health">Eye Health</option>
                    </select>
                    <Link
                      to="/questions"
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View all
                    </Link>
                  </div>
                </div>

                {isLoading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <div className="text-center text-red-600 py-8">
                    Error loading questions. Please try again later.
                  </div>
                ) : filteredQuestions?.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No questions found in this category.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredQuestions?.map((question) => (
                      <div 
                        key={question.id} 
                        className="border-b border-gray-200 last:border-0 pb-6"
                      >
                        <Link 
                          to={`/questions/${question.id}`}
                          className="block hover:bg-gray-50 rounded-lg p-4 transition"
                        >
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {question.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{question.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{question.author}</span>
                            <span className="mx-2">•</span>
                            <span>{question.date}</span>
                            <span className="mx-2">•</span>
                            <span>{question.answers} answers</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block w-[300px] space-y-6">
              <AdUnit slot="sidebar" format="rectangle" className="sticky top-24" />
              
              {/* Expert Panel */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Featured Experts</h3>
                <div className="space-y-4">
                  {/* Add expert profiles here */}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Helpful Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/guide/choosing-frames" className="text-indigo-600 hover:text-indigo-700">
                      Guide to Choosing Frames
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide/prescription-reading" className="text-indigo-600 hover:text-indigo-700">
                      Understanding Your Prescription
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide/lens-types" className="text-indigo-600 hover:text-indigo-700">
                      Types of Lenses Explained
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        <Footer />

        {/* Newsletter Modal */}
        {showNewsletterModal && (
          <NewsletterModal onClose={() => setShowNewsletterModal(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  const { isAuthenticated, user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Header 
          onAuthClick={() => setIsAuthModalOpen(true)}
          user={user}
          isAuthenticated={isAuthenticated}
        />
        
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/ask" 
              element={
                isAuthenticated ? <QuestionForm /> : <Navigate to="/login" />
              } 
            />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/questions/:id" element={<QuestionDetails />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? <UserProfile /> : <Navigate to="/login" />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
