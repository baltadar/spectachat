import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Question } from '../types';
import { format } from 'date-fns';
import { AdUnit } from '../components/AdUnit';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const searchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error: searchError } = await supabase
          .from('questions')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .order('created_at', { ascending: false });

        if (searchError) throw searchError;
        setQuestions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchQuestions();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>

      {/* Top ad */}
      <AdUnit slot="search-top" className="mb-8" />

      <div className="lg:flex lg:space-x-8">
        <div className="flex-1">
          {questions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No questions found matching your search.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <React.Fragment key={question.id}>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <Link
                      to={`/questions/${question.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-indigo-600"
                    >
                      {question.title}
                    </Link>
                    <div className="mt-2 text-gray-600 line-clamp-2">
                      {question.content}
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="capitalize">{question.category}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(question.created_at), 'MMM d, yyyy')}</span>
                      <span className="mx-2">•</span>
                      <span>{question.answer_count} answers</span>
                    </div>
                  </div>
                  {/* Insert ad after every 5 questions */}
                  {(index + 1) % 5 === 0 && (
                    <AdUnit slot="search-list" className="my-6" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar ad */}
        <div className="hidden lg:block w-[300px]">
          <AdUnit slot="search-sidebar" format="rectangle" className="sticky top-24" />
        </div>
      </div>
    </div>
  );
}