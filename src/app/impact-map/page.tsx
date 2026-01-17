import { createClient } from '@/lib/supabase/server';
import { ImpactMapClient } from './client';

export const dynamic = 'force-dynamic';

async function getEntitiesWithConnections() {
    const supabase = await createClient();

    // Get entities with article counts
    const { data: entities, error: entitiesError } = await supabase
        .from('entities')
        .select(`
      id,
      name,
      type,
      article_entities (count)
    `)
        .limit(30);

    if (entitiesError) {
        console.error('Error fetching entities:', entitiesError);
        return { entities: [], connections: [] };
    }

    // Transform entities
    const transformedEntities = (entities || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        articleCount: e.article_entities?.[0]?.count || 0,
    }));

    // Get articles with multiple entities to find connections
    const { data: articleEntities, error: connError } = await supabase
        .from('article_entities')
        .select('article_id, entity_id')
        .limit(200);

    if (connError) {
        console.error('Error fetching connections:', connError);
        return { entities: transformedEntities, connections: [] };
    }

    // Build connections from co-occurring entities in articles
    const articleToEntities: Record<string, string[]> = {};
    (articleEntities || []).forEach((ae: any) => {
        if (!articleToEntities[ae.article_id]) {
            articleToEntities[ae.article_id] = [];
        }
        articleToEntities[ae.article_id].push(ae.entity_id);
    });

    const connectionMap: Record<string, number> = {};
    Object.values(articleToEntities).forEach((entityIds) => {
        if (entityIds.length > 1) {
            for (let i = 0; i < entityIds.length; i++) {
                for (let j = i + 1; j < entityIds.length; j++) {
                    const key = [entityIds[i], entityIds[j]].sort().join('-');
                    connectionMap[key] = (connectionMap[key] || 0) + 1;
                }
            }
        }
    });

    // Create connections array with weights
    const connections = Object.entries(connectionMap)
        .filter(([_, count]) => count >= 1)
        .map(([key, count]) => {
            const [source, target] = key.split('-');
            return {
                source,
                target,
                weight: Math.min(count / 5, 1), // Normalize weight
            };
        })
        .slice(0, 50); // Limit connections

    return { entities: transformedEntities, connections };
}

export default async function ImpactMapPage() {
    const { entities, connections } = await getEntitiesWithConnections();

    return (
        <div className="h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Impact Map</h1>
                    <p className="text-[var(--muted-foreground)] font-sans text-sm mt-1">
                        Visualize connections between entities across news events
                    </p>
                </div>
                <div className="text-sm font-sans text-[var(--muted-foreground)]">
                    {entities.length} entities • {connections.length} connections
                </div>
            </div>

            {entities.length === 0 ? (
                <div className="flex items-center justify-center h-96 border border-dashed border-[var(--border)] rounded-lg">
                    <div className="text-center">
                        <span className="text-6xl mb-4 block">🌐</span>
                        <h3 className="text-xl font-bold mb-2">No entities yet</h3>
                        <p className="text-[var(--muted-foreground)] font-sans text-sm max-w-md">
                            Entities will appear here after news articles are ingested and processed by AI
                        </p>
                    </div>
                </div>
            ) : (
                <ImpactMapClient entities={entities} connections={connections} />
            )}
        </div>
    );
}
