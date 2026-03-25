import Supermemory from 'supermemory';
import type { MemoryResult, ProfileResult } from '../types';

const TIMEOUT = 30_000;
const API_BASE = 'https://api.supermemory.ai';
const ENTITY_CONTEXT =
    'Extract and remember: user preferences, coding patterns, architectural decisions, debugging insights, project conventions, technical context, and workflow habits.';

export class SupermemoryClient {
    private client: Supermemory;
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = new Supermemory({ apiKey });
    }

    async addMemory(
        content: string,
        containerTag: string,
        metadata?: Record<string, unknown>,
    ): Promise<void> {
        const res = await Promise.race([
            fetch(`${API_BASE}/v4/memories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memories: [{ content, metadata }],
                    containerTag,
                }),
            }),
            timeout(TIMEOUT),
        ]);

        if (!res.ok) {
            const body = await res.text();
            throw new Error(`${res.status} ${body}`);
        }
    }

    async addContent(
        content: string,
        containerTag: string,
        metadata?: Record<string, unknown>,
    ): Promise<void> {
        await Promise.race([
            this.client.add({
                content,
                containerTag,
                metadata,
                entityContext: ENTITY_CONTEXT,
            }),
            timeout(TIMEOUT),
        ]);
    }

    async searchMemories(
        query: string,
        containerTag: string,
        limit = 5,
    ): Promise<MemoryResult[]> {
        const result = (await Promise.race([
            this.client.search.memories({
                q: query,
                containerTag,
                limit,
                searchMode: 'hybrid',
            }),
            timeout(TIMEOUT),
        ])) as any;

        if (!result?.results) return [];

        return result.results.map((r: any) => ({
            id: r.id,
            content: r.memory || r.chunk || r.content || r.text || '',
            score: r.similarity,
            createdAt: r.updatedAt || r.createdAt,
            metadata: r.metadata,
        }));
    }

    async getProfile(containerTag: string, query?: string): Promise<ProfileResult> {
        const result = (await Promise.race([
            this.client.profile({
                containerTag,
                q: query,
            }),
            timeout(TIMEOUT),
        ])) as any;

        const profile = result?.profile;
        return {
            staticFacts: profile?.static || [],
            dynamicFacts: profile?.dynamic || [],
        };
    }

    async listMemories(containerTag: string, limit = 10): Promise<MemoryResult[]> {
        const result = (await Promise.race([
            this.client.documents.list({
                containerTags: [containerTag],
                limit,
                order: 'desc',
                sort: 'createdAt',
                includeContent: true,
            }),
            timeout(TIMEOUT),
        ])) as any;

        if (!result?.memories) return [];

        return result.memories.map((doc: any) => ({
            id: doc.id,
            content: doc.summary || doc.content || doc.title || '',
            createdAt: doc.createdAt,
            metadata: typeof doc.metadata === 'object' && doc.metadata !== null ? doc.metadata as Record<string, unknown> : undefined,
        }));
    }

    async deleteMemory(memoryId: string, containerTag: string): Promise<void> {
        await Promise.race([
            this.client.memories.forget({ id: memoryId, containerTag }),
            timeout(TIMEOUT),
        ]);
    }
}

function timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
}
