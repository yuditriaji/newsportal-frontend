const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiClientOptions extends RequestInit {
    token?: string;
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status: number, message: string, data?: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export async function apiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new ApiError(response.status, data.error || 'Request failed', data);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// Typed API methods
export const api = {
    // Articles
    getArticles: (params?: { page?: number; limit?: number; category?: string }) =>
        apiClient<{ data: Article[]; meta: PaginationMeta }>(
            `/api/v1/articles?${new URLSearchParams(params as any)}`
        ),

    getArticle: (id: string) =>
        apiClient<Article>(`/api/v1/articles/${id}`),

    getRelatedArticles: (id: string) =>
        apiClient<{ data: Article[] }>(`/api/v1/articles/${id}/related`),

    // Entities
    getEntities: (params?: { type?: string }) =>
        apiClient<{ data: Entity[] }>(
            `/api/v1/entities?${new URLSearchParams(params as any)}`
        ),

    getEntity: (id: string) =>
        apiClient<Entity>(`/api/v1/entities/${id}`),

    getEntityConnections: (id: string) =>
        apiClient<{ data: EntityConnection[] }>(`/api/v1/entities/${id}/connections`),

    // Investigations
    getInvestigations: (token: string) =>
        apiClient<{ data: Investigation[] }>('/api/v1/investigations', { token }),

    createInvestigation: (data: { title: string; description?: string }, token: string) =>
        apiClient<Investigation>('/api/v1/investigations', {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    getInvestigation: (id: string, token: string) =>
        apiClient<Investigation>(`/api/v1/investigations/${id}`, { token }),

    // Auth
    verifyToken: (token: string) =>
        apiClient<{ user: User }>('/api/v1/auth/verify', {
            method: 'POST',
            token,
        }),

    getMe: (token: string) =>
        apiClient<User>('/api/v1/auth/me', { token }),
};

// Types
export interface Article {
    id: string;
    title: string;
    excerpt: string;
    summary?: string;
    url: string;
    image_url?: string;
    published_at: string;
    category?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    sentiment_score?: number;
    news_sources?: {
        name: string;
        credibility_score: number;
        tier: string;
    };
}

export interface Entity {
    id: string;
    name: string;
    type: string;
    aliases?: string[];
    metadata?: Record<string, unknown>;
    articleCount?: number;
}

export interface EntityConnection {
    relatedEntity: Entity;
    relationship: { type: string; weight: number };
}

export interface Investigation {
    id: string;
    title: string;
    description?: string;
    owner_id: string;
    status: string;
    visibility: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
}
