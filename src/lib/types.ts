export interface Thought {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
}

export interface OptimisticThought extends Thought {
  pending: boolean;
}
