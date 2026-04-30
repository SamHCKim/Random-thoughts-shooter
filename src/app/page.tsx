import { createClient } from '@/lib/supabase/server';
import { type Thought } from '@/lib/types';
import Board from '@/components/Board';

export default async function HomePage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch thoughts: ${error.message}`);
  }

  const thoughts = (data ?? []) as Thought[];

  return <Board initialThoughts={thoughts} />;
}
