import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'question' | 'answer';
  initialVotes: number;
  onVoteChange: (newVoteCount: number) => void;
}

export function VoteButtons({ targetId, targetType, initialVotes, onVoteChange }: VoteButtonsProps) {
  const [userVote, setUserVote] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserVote = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: voteData } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user.id)
        .eq('target_id', targetId)
        .eq('target_type', targetType)
        .single();

      if (voteData) {
        setUserVote(voteData.vote_type);
      }
    };

    fetchUserVote();
  }, [targetId, targetType]);

  const handleVote = async (voteType: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be signed in to vote');
        return;
      }

      const newVoteType = userVote === voteType ? 0 : voteType;
      
      if (userVote === 0) {
        // Insert new vote
        await supabase
          .from('votes')
          .insert([{
            user_id: user.id,
            target_id: targetId,
            target_type: targetType,
            vote_type: newVoteType,
          }]);
      } else {
        // Update or delete existing vote
        if (newVoteType === 0) {
          await supabase
            .from('votes')
            .delete()
            .eq('user_id', user.id)
            .eq('target_id', targetId)
            .eq('target_type', targetType);
        } else {
          await supabase
            .from('votes')
            .update({ vote_type: newVoteType })
            .eq('user_id', user.id)
            .eq('target_id', targetId)
            .eq('target_type', targetType);
        }
      }

      // Update vote count in the UI
      const voteChange = newVoteType - userVote;
      onVoteChange(initialVotes + voteChange);
      setUserVote(newVoteType);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(1)}
        className={`p-1 rounded-full hover:bg-gray-100 ${
          userVote === 1 ? 'text-indigo-600' : 'text-gray-500'
        }`}
        aria-label="Vote up"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
      
      <span className="text-sm font-medium text-gray-700">
        {initialVotes}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        className={`p-1 rounded-full hover:bg-gray-100 ${
          userVote === -1 ? 'text-red-600' : 'text-gray-500'
        }`}
        aria-label="Vote down"
      >
        <ChevronDown className="h-6 w-6" />
      </button>

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
}