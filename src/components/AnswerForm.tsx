import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';

interface AnswerFormProps {
  questionId: string;
  onAnswerSubmitted: () => void;
}

interface AnswerFormData {
  content: string;
}

export function AnswerForm({ questionId, onAnswerSubmitted }: AnswerFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnswerFormData>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: AnswerFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be signed in to answer');
        return;
      }

      const { error: answerError } = await supabase
        .from('answers')
        .insert([{
          content: data.content,
          question_id: questionId,
          user_id: user.id,
        }]);

      if (answerError) throw answerError;

      // Update question's answer count
      await supabase.rpc('increment_answer_count', { question_id: questionId });

      reset();
      onAnswerSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Your Answer</h3>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <textarea
            {...register('content', { required: true })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Write your answer here..."
          />
          {errors.content && (
            <span className="text-red-500 text-sm">Answer content is required</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post Answer
        </button>
      </form>
    </div>
  );
}