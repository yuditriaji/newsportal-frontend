/**
 * Stories Server Actions
 * 
 * Server-side functions for fetching stories from the backend.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface StorySection {
    title: string;
    content: string;
    citations: Array<{ source: string; article_id: string }>;
}

export interface StoryArticle {
    id: string;
    title: string;
    excerpt: string;
    url: string;
    image_url?: string;
    published_at: string;
    source: string;
    source_logo?: string;
}

export interface StoryEntity {
    id: string;
    name: string;
    type: string;
    role: string;
    context?: string;
}

export interface StoryConnection {
    id: string;
    source: { id: string; name: string; type: string };
    target: { id: string; name: string; type: string };
    relationship: string;
    label?: string;
    strength: number;
    evidence?: string;
}

export interface StoryImpact {
    sector: string;
    sectorName?: string;
    icon?: string;
    color?: string;
    type: 'positive' | 'negative' | 'neutral' | 'uncertain';
    severity: number;
    prediction: string;
    confidence: number;
}

export interface StoryDetail {
    id: string;
    title: string;
    slug: string;
    summary: string;
    synthesis: StorySection[];
    hero_image_url?: string;
    source_count: number;
    published_at: string;
    articles: StoryArticle[];
    entities: StoryEntity[];
    connections: StoryConnection[];
    impacts: StoryImpact[];
}

export interface StoryListItem {
    id: string;
    title: string;
    slug: string;
    summary: string;
    hero_image_url?: string;
    source_count: number;
    published_at: string;
    sources: Array<{ name: string }>;
    impacts: Array<{ sector: string; type: string; severity: number }>;
}

/**
 * Get list of published stories
 */
export async function getStories(limit: number = 20): Promise<StoryListItem[]> {
    const supabase = await createClient();

    const { data: stories, error } = await supabase
        .from('stories')
        .select(`
      id,
      title,
      slug,
      summary,
      hero_image_url,
      source_count,
      published_at,
      story_articles (
        articles (
          news_sources ( name )
        )
      ),
      story_impacts (
        sector_id,
        impact_type,
        severity
      )
    `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching stories:', error);
        return [];
    }

    return (stories || []).map((story: any) => ({
        id: story.id,
        title: story.title,
        slug: story.slug,
        summary: story.summary,
        hero_image_url: story.hero_image_url,
        source_count: story.source_count,
        published_at: story.published_at,
        sources: story.story_articles?.map((sa: any) => ({
            name: sa.articles?.news_sources?.name,
        })).filter((s: any) => s.name) || [],
        impacts: story.story_impacts?.map((i: any) => ({
            sector: i.sector_id,
            type: i.impact_type,
            severity: i.severity,
        })) || [],
    }));
}

/**
 * Get full story detail by slug
 */
export async function getStoryBySlug(slug: string): Promise<StoryDetail | null> {
    const supabase = await createClient();

    // Get story with related data
    const { data: story, error } = await supabase
        .from('stories')
        .select(`
      *,
      story_articles (
        relevance_score,
        articles (
          id,
          title,
          excerpt,
          url,
          image_url,
          published_at,
          news_sources ( name )
        )
      ),
      story_entities (
        role,
        context,
        entities (
          id,
          name,
          type
        )
      ),
      story_impacts (
        sector_id,
        impact_type,
        severity,
        prediction,
        confidence,
        impact_sectors ( name, icon, color )
      )
    `)
        .eq('slug', slug)
        .single();

    if (error || !story) {
        console.error('Error fetching story:', error);
        return null;
    }

    // Get entity connections
    const entityIds = story.story_entities?.map((se: any) => se.entities?.id).filter(Boolean) || [];
    let connections: any[] = [];

    if (entityIds.length > 0) {
        const { data: connData } = await supabase
            .from('entity_connections')
            .select(`
        id,
        relationship_type,
        relationship_label,
        strength,
        evidence,
        source_entity:entities!entity_connections_source_entity_id_fkey ( id, name, type ),
        target_entity:entities!entity_connections_target_entity_id_fkey ( id, name, type )
      `)
            .or(`source_entity_id.in.(${entityIds.join(',')}),target_entity_id.in.(${entityIds.join(',')})`);

        connections = connData || [];
    }

    return {
        id: story.id,
        title: story.title,
        slug: story.slug,
        summary: story.summary,
        synthesis: story.synthesis || [],
        hero_image_url: story.hero_image_url,
        source_count: story.source_count,
        published_at: story.published_at,
        articles: story.story_articles?.map((sa: any) => ({
            id: sa.articles?.id,
            title: sa.articles?.title,
            excerpt: sa.articles?.excerpt,
            url: sa.articles?.url,
            image_url: sa.articles?.image_url,
            published_at: sa.articles?.published_at,
            source: sa.articles?.news_sources?.name || 'Unknown',
        })).filter((a: any) => a.id) || [],
        entities: story.story_entities?.map((se: any) => ({
            id: se.entities?.id,
            name: se.entities?.name,
            type: se.entities?.type,
            role: se.role,
            context: se.context,
        })).filter((e: any) => e.id) || [],
        connections: connections.map((c: any) => ({
            id: c.id,
            source: {
                id: c.source_entity?.id,
                name: c.source_entity?.name,
                type: c.source_entity?.type,
            },
            target: {
                id: c.target_entity?.id,
                name: c.target_entity?.name,
                type: c.target_entity?.type,
            },
            relationship: c.relationship_type,
            label: c.relationship_label,
            strength: c.strength,
            evidence: c.evidence,
        })),
        impacts: story.story_impacts?.map((i: any) => ({
            sector: i.sector_id,
            sectorName: i.impact_sectors?.name,
            icon: i.impact_sectors?.icon,
            color: i.impact_sectors?.color,
            type: i.impact_type,
            severity: i.severity,
            prediction: i.prediction,
            confidence: i.confidence,
        })) || [],
    };
}
