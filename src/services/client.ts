import Supermemory from 'supermemory';
import type { MemoryResult, ProfileResult } from '../types';

const TIMEOUT = 30_000;
const ENTITY_CONTEXT =
    'Extract and remember: user preferences, coding patterns, architectural decisions, debugging insights, project conventions, technical context, and workflow habits.';

export class SupermemoryClient {
    private client: Supermemory;

    constructor(apiKey: string) {
        this.client = new Supermemory({ apiKey });
    }

    async addMemory(
        content: string,
        containerTag: string,
        metadata?: Record<string, unknown>,
    ): Promise<void> {
        await Promise.race([
            this.client.add({
                content,
                containerTags: [containerTag],
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
                containerTags: [containerTag],
                limit,
            }),
            timeout(TIMEOUT),
        ])) as any;

        if (!result?.results) return [];

        return result.results.map((r: any) => ({
            id: r.id,
            content: r.content || r.text || '',
            score: r.score,
            createdAt: r.createdAt,
            metadata: r.metadata,
        }));
    }

    async getProfile(containerTag: string, query?: string): Promise<ProfileResult> {
        const result = (await Promise.race([
            this.client.profile({
                containerTags: [containerTag],
                q: query,
            }),
            timeout(TIMEOUT),
        ])) as any;

        return {
            staticFacts: result?.staticFacts || result?.facts || [],
            dynamicFacts: result?.dynamicFacts || result?.recentContext || [],
        };
    }

    async listMemories(containerTag: string, limit = 10): Promise<MemoryResult[]> {
        const result = (await Promise.race([
            this.client.search.memories({
                containerTags: [containerTag],
                limit,
            }),
            timeout(TIMEOUT),
        ])) as any;

        if (!result?.results) return [];

        return result.results
            .map((r: any) => ({
                id: r.id,
                content: r.content || r.text || '',
                score: r.score,
                createdAt: r.createdAt,
                metadata: r.metadata,
            }))
            .sort((a: MemoryResult, b: MemoryResult) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }

    async deleteMemory(memoryId: string): Promise<void> {
        await Promise.race([(this.client as any).delete({ id: memoryId }), timeout(TIMEOUT)]);
    }
}

function timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
}
