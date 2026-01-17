'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Add article to investigation
export async function addArticleToInvestigation(
    articleId: string,
    investigationId: string,
    notes?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // Verify ownership
    const { data: investigation } = await supabase
        .from('investigations')
        .select('owner_id')
        .eq('id', investigationId)
        .single();

    if (!investigation || investigation.owner_id !== user.id) {
        return { error: 'Investigation not found or unauthorized' };
    }

    const { error } = await supabase
        .from('investigation_articles')
        .upsert({
            investigation_id: investigationId,
            article_id: articleId,
            added_by: user.id,
            notes,
        }, { onConflict: 'investigation_id,article_id' });

    if (error) {
        return { error: error.message };
    }

    // Update investigation timestamp
    await supabase
        .from('investigations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', investigationId);

    revalidatePath(`/investigations/${investigationId}`);
    return { success: true };
}

// Remove article from investigation
export async function removeArticleFromInvestigation(
    articleId: string,
    investigationId: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('investigation_articles')
        .delete()
        .eq('investigation_id', investigationId)
        .eq('article_id', articleId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/investigations/${investigationId}`);
    return { success: true };
}

// Add entity to watchlist
export async function addToWatchlist(entityId: string, notify: boolean = true) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('watchlist')
        .upsert({
            user_id: user.id,
            entity_id: entityId,
            notify,
        }, { onConflict: 'user_id,entity_id' });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/watchlist');
    return { success: true };
}

// Remove from watchlist
export async function removeFromWatchlist(entityId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('entity_id', entityId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/watchlist');
    return { success: true };
}

// Toggle watchlist alert
export async function toggleWatchlistAlert(entityId: string, notify: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('watchlist')
        .update({ notify })
        .eq('user_id', user.id)
        .eq('entity_id', entityId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/watchlist');
    return { success: true };
}

// Update investigation status
export async function updateInvestigationStatus(
    investigationId: string,
    status: 'active' | 'archived' | 'draft'
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('investigations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', investigationId)
        .eq('owner_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/investigations');
    revalidatePath(`/investigations/${investigationId}`);
    return { success: true };
}

// Delete investigation
export async function deleteInvestigation(investigationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', investigationId)
        .eq('owner_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/investigations');
    return { success: true };
}
