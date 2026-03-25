import type { SupermemoryConfig, MemoryResult, ProfileResult } from '../types';

export function formatContext(
    profile: ProfileResult | null,
    userMemories: MemoryResult[],
    projectMemories: MemoryResult[],
    config: SupermemoryConfig,
): string {
    const sections: string[] = [];

    // Profile section
    if (config.injectProfile && profile) {
        const facts = [
            ...profile.staticFacts.slice(0, config.maxProfileItems),
            ...profile.dynamicFacts.slice(0, 3),
        ];
        if (facts.length > 0) {
            sections.push('## User Profile\n' + facts.map((f) => `- ${f}`).join('\n'));
        }
    }

    // User memories
    if (userMemories.length > 0) {
        const formatted = userMemories
            .filter((m) => !m.score || m.score >= config.similarityThreshold)
            .slice(0, config.maxMemories)
            .map((m) => {
                const score = m.score ? `[${Math.round(m.score * 100)}%]` : '';
                const age = m.createdAt ? ` (${relativeTime(m.createdAt)})` : '';
                return `- ${score} ${m.content.slice(0, 500)}${age}`;
            })
            .join('\n');
        if (formatted) {
            sections.push('## Relevant Memories\n' + formatted);
        }
    }

    // Project memories
    if (projectMemories.length > 0) {
        const formatted = projectMemories
            .slice(0, config.maxProjectMemories)
            .map((m) => {
                const score = m.score ? `[${Math.round(m.score * 100)}%]` : '';
                return `- ${score} ${m.content.slice(0, 500)}`;
            })
            .join('\n');
        if (formatted) {
            sections.push('## Project Knowledge\n' + formatted);
        }
    }

    if (sections.length === 0) return '';

    return [
        '<supermemory-context>',
        'The following context is from your persistent memory (Supermemory).',
        'Use it naturally when relevant — do not force it into every response.',
        '',
        ...sections,
        '</supermemory-context>',
    ].join('\n');
}

export function formatSearchResults(memories: MemoryResult[], scope: string): string {
    if (memories.length === 0) {
        return `No memories found in ${scope} scope.`;
    }

    const lines = memories.map((m, i) => {
        const score = m.score ? ` (${Math.round(m.score * 100)}% match)` : '';
        const age = m.createdAt ? ` — ${relativeTime(m.createdAt)}` : '';
        const id = m.id ? `\n  ID: ${m.id}` : '';
        return `${i + 1}. ${m.content.slice(0, 800)}${score}${age}${id}`;
    });

    return `Found ${memories.length} memories (${scope}):\n\n${lines.join('\n\n')}`;
}

export function formatProfileResults(profile: ProfileResult): string {
    const sections: string[] = [];

    if (profile.staticFacts.length > 0) {
        sections.push('**Profile Facts:**\n' + profile.staticFacts.map((f) => `- ${f}`).join('\n'));
    }

    if (profile.dynamicFacts.length > 0) {
        sections.push(
            '**Recent Context:**\n' + profile.dynamicFacts.map((f) => `- ${f}`).join('\n'),
        );
    }

    if (sections.length === 0) {
        return 'No profile data available yet. Use Supermemory more to build your profile.';
    }

    return sections.join('\n\n');
}

export function formatListResults(memories: MemoryResult[]): string {
    if (memories.length === 0) {
        return 'No memories stored yet.';
    }

    const lines = memories.map((m, i) => {
        const age = m.createdAt ? ` — ${relativeTime(m.createdAt)}` : '';
        const type = m.metadata?.type ? ` [${m.metadata.type}]` : '';
        const id = m.id ? `\n  ID: ${m.id}` : '';
        return `${i + 1}.${type} ${m.content.slice(0, 400)}${age}${id}`;
    });

    return `Stored memories (${memories.length}):\n\n${lines.join('\n\n')}`;
}

function relativeTime(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}
