export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  category: 'prescription' | 'non-prescription' | 'frames' | 'lenses' | 'brands' | 'providers';
  user_id: string;
  created_at: string;
  updated_at: string;
  votes: number;
  answer_count: number;
}

export interface Answer {
  id: string;
  content: string;
  question_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  votes: number;
  is_accepted: boolean;
}