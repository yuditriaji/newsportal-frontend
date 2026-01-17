'use server';

import { createClient } from '@/lib/supabase/server';

export interface TrendingEntity {
    id: string;
    name: string;
    type: string;
    articleCount: number;
}

export async function getTrendingEntities(limit: number = 5): Promise<TrendingEntity[]> {
    const supabase = await createClient();

    // We want entities with the most articles.
    // Since we can't easily do aggregate sorts in one simple query with the JS client without RPC,
    // we'll fetch entities and their counts, then sort in memory (efficient enough for small datasets).
    // Ideally, create a database view or RPC for this.

    const { data, error } = await supabase
        .from('entities')
        .select(`
      id,
      name,
      type,
      article_entities (count)
    `)
        .limit(50); // Fetch more candidates to sort

    if (error) {
        console.error('Error fetching trending entities:', error);
        return [];
    }

    const entities = data.map((e: any) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        articleCount: e.article_entities?.[0]?.count || 0
    }));

    // Sort by article count desc
    entities.sort((a, b) => b.articleCount - a.articleCount);

    return entities.slice(0, limit);
}
