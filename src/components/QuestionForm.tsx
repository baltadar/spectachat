import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Question } from '../types';

interface QuestionFormData {
  title: string;
  content: string;
  category: Question['category'];
}

export function QuestionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<QuestionFormData>();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be signed in to ask a question');
        return;
      }

      const { error: questionError } = await supabase
        .from('questions')
        .insert([{
          ...data,
          user_id: user.id,
        }]);

      if (questionError) throw questionError;

      navigate('/questions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            {...register('title', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="What's your question about spectacles?"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register('category', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="prescription">Prescription</option>
            <option value="non-prescription">Non-Prescription</option>
            <option value="frames">Frames</option>
            <option value="lenses">Lenses</option>
            <option value="brands">Brands</option>
            <option value="providers">Providers</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">Category is required</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            {...register('content', { required: true })}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Provide details about your question..."
          />
          {errors.content && (
            <span className="text-red-500 text-sm">Content is required</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post Question
        </button>
      </form>
    </div>
  );
}