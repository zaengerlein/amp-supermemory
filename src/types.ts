export interface SupermemoryConfig {
    apiKey?: string;
    similarityThreshold: number;
    maxMemories: number;
    maxProjectMemories: number;
    maxProfileItems: number;
    injectProfile: boolean;
    containerTagPrefix: string;
    userContainerTag?: string;
    projectContainerTag?: string;
    compactionThreshold: number;
    filterPrompt: string;
}

export interface Credentials {
    apiKey: string;
    createdAt: string;
}

export interface ContainerTags {
    user: string;
    project: string;
}

export type MemoryScope = 'user' | 'project' | 'both';

export interface MemoryResult {
    id: string;
    content: string;
    score?: number;
    createdAt?: string;
    metadata?: Record<string, unknown>;
}

export interface ProfileResult {
    staticFacts: string[];
    dynamicFacts: string[];
}

export interface FormattedContext {
    profile: string;
    userMemories: string;
    projectMemories: string;
}

export const DEFAULT_CONFIG: SupermemoryConfig = {
    similarityThreshold: 0.6,
    maxMemories: 5,
    maxProjectMemories: 10,
    maxProfileItems: 5,
    injectProfile: true,
    containerTagPrefix: 'amp',
    compactionThreshold: 0.8,
    filterPrompt:
        'You are a stateful coding agent memory system. Filter and extract only information that would be useful for a coding assistant to remember across sessions: code patterns, user preferences, architectural decisions, debugging insights, project conventions, and technical context.',
};
