// @i-know-the-amp-plugin-api-is-wip-and-very-experimental-right-now
import type { PluginAPI } from '@ampcode/plugin';
import { SupermemoryClient } from './services/client';
import { loadConfig, getApiKey, deleteCredentials } from './services/config';
import { startAuthFlow } from './services/auth';
import { generateTags } from './services/tags';
import { stripPrivateContent } from './services/privacy';
import {
    formatContext,
    formatSearchResults,
    formatProfileResults,
    formatListResults,
} from './services/context';
import type { ContainerTags, SupermemoryConfig } from './types';

export default function supermemoryPlugin(amp: PluginAPI) {
    const config = loadConfig();
    let client: SupermemoryClient | null = null;
    let tags: ContainerTags | null = null;
    const injectedSessions = new Set<string>();

    function ensureClient(): SupermemoryClient | null {
        if (client) return client;
        const apiKey = getApiKey(config);
        if (!apiKey) return null;
        client = new SupermemoryClient(apiKey);
        return client;
    }

    // -------------------------------------------------------------------
    // Context injection on first message of each session
    // -------------------------------------------------------------------
    amp.on('agent.start', async (event, ctx) => {
        const sessionKey = `${event.id}`;

        // Only inject on the first user message (id === 1)
        if (event.id !== 1) return {};

        const c = ensureClient();
        if (!c) {
            return {
                message: {
                    content:
                        '<supermemory-context>\nSupermemory is not connected. Use the "supermemory: login" command (Ctrl-O) to authenticate.\n</supermemory-context>',
                    display: true,
                },
            };
        }

        // Get the working directory from shell
        let cwd = process.cwd();
        try {
            const result = await ctx.$`pwd`;
            if (result.stdout.trim()) cwd = result.stdout.trim();
        } catch {
            // Use process.cwd() fallback
        }

        tags = tags || generateTags(cwd, config);

        try {
            // Fetch profile and memories in parallel
            const [profile, userMemories, projectMemories] = await Promise.all([
                config.injectProfile
                    ? c.getProfile(tags.user, event.message).catch(() => null)
                    : Promise.resolve(null),
                c.searchMemories(event.message, tags.user, config.maxMemories).catch(() => []),
                c.listMemories(tags.project, config.maxProjectMemories).catch(() => []),
            ]);

            const contextStr = formatContext(profile, userMemories, projectMemories, config);
            if (!contextStr) return {};

            return { message: { content: contextStr, display: true } };
        } catch (err) {
            amp.logger.log('Failed to fetch Supermemory context:', err);
            return {};
        }
    });

    // -------------------------------------------------------------------
    // Save session summary on agent end (first turn only to avoid spam)
    // -------------------------------------------------------------------
    amp.on('agent.end', async (event, ctx) => {
        // Save the user's message as context for future sessions
        const c = ensureClient();
        if (!c || !tags) return {};

        // Only save substantive messages (skip very short ones)
        if (event.message && event.message.length > 20) {
            try {
                const sessionId = `amp_session_${Date.now()}`;
                await c.addMemory(
                    `[User request] ${event.message}`,
                    tags.user,
                    { type: 'session', source: 'amp' },
                );
            } catch (err) {
                amp.logger.log('Failed to save session memory:', err);
            }
        }

        return {};
    });

    // -------------------------------------------------------------------
    // Main supermemory tool
    // -------------------------------------------------------------------
    amp.registerTool({
        name: 'supermemory',
        description: `Persistent memory across Amp sessions. Use this tool to save important information, search past memories, view your profile, list stored memories, or forget specific memories.

Modes:
- "save": Save important context (architecture decisions, debugging insights, user preferences, conventions). Content should be a clear, self-contained description. Specify scope "user" for personal or "project" for team-shared.
- "search": Search past memories semantically. Specify scope "user", "project", or "both".
- "profile": View your auto-built profile of preferences and patterns.
- "list": List recent stored memories. Specify scope "user" or "project".
- "forget": Delete a specific memory by ID.

Use this tool proactively when:
- The user asks you to remember something
- You discover important patterns, conventions, or decisions
- You encounter and resolve tricky bugs
- The user shares preferences about coding style or workflow`,
        inputSchema: {
            type: 'object',
            properties: {
                mode: {
                    type: 'string',
                    enum: ['save', 'search', 'profile', 'list', 'forget'],
                    description: 'The operation to perform',
                },
                content: {
                    type: 'string',
                    description: 'For "save": the content to remember. For "search": the search query.',
                },
                scope: {
                    type: 'string',
                    enum: ['user', 'project', 'both'],
                    description:
                        'Memory scope. "user" = personal cross-project memories, "project" = shared project knowledge. Default: "user" for save, "both" for search.',
                },
                memoryId: {
                    type: 'string',
                    description: 'For "forget": the ID of the memory to delete.',
                },
            },
            required: ['mode'],
        },
        async execute(input) {
            const mode = input.mode as string;
            const content = input.content as string | undefined;
            const scope = (input.scope as string) || (mode === 'search' ? 'both' : 'user');
            const memoryId = input.memoryId as string | undefined;

            const c = ensureClient();
            if (!c) {
                return 'Supermemory is not connected. Use the "supermemory: login" command (Ctrl-O) to authenticate, or set SUPERMEMORY_API_KEY environment variable.';
            }

            let cwd = process.cwd();
            tags = tags || generateTags(cwd, config);

            switch (mode) {
                case 'save': {
                    if (!content) return 'Error: content is required for save mode.';
                    const sanitized = stripPrivateContent(content);
                    const tag = scope === 'project' ? tags.project : tags.user;
                    const metaType = scope === 'project' ? 'project-knowledge' : 'manual';
                    await c.addMemory(sanitized, tag, { type: metaType, source: 'amp-tool' });
                    return `Memory saved to ${scope} scope.`;
                }

                case 'search': {
                    if (!content) return 'Error: content (query) is required for search mode.';
                    const results: string[] = [];

                    if (scope === 'user' || scope === 'both') {
                        const memories = await c.searchMemories(content, tags.user, config.maxMemories);
                        results.push(formatSearchResults(memories, 'user'));
                    }
                    if (scope === 'project' || scope === 'both') {
                        const memories = await c.searchMemories(content, tags.project, config.maxProjectMemories);
                        results.push(formatSearchResults(memories, 'project'));
                    }

                    return results.join('\n\n---\n\n');
                }

                case 'profile': {
                    const tag = scope === 'project' ? tags.project : tags.user;
                    const profile = await c.getProfile(tag);
                    return formatProfileResults(profile);
                }

                case 'list': {
                    const tag = scope === 'project' ? tags.project : tags.user;
                    const limit = scope === 'project' ? config.maxProjectMemories : config.maxMemories;
                    const memories = await c.listMemories(tag, limit);
                    return formatListResults(memories);
                }

                case 'forget': {
                    if (!memoryId) return 'Error: memoryId is required for forget mode.';
                    await c.deleteMemory(memoryId);
                    return `Memory ${memoryId} deleted.`;
                }

                default:
                    return `Unknown mode: ${mode}. Use save, search, profile, list, or forget.`;
            }
        },
    });

    // -------------------------------------------------------------------
    // Commands
    // -------------------------------------------------------------------
    amp.registerCommand('login', {
        title: 'Login',
        category: 'Supermemory',
        description: 'Connect to Supermemory for persistent memory across sessions',
    }, async (ctx) => {
        const existingKey = getApiKey(config);
        if (existingKey) {
            const reconnect = await ctx.ui.confirm({
                title: 'Already Connected',
                message: 'Supermemory is already connected. Do you want to reconnect with a different account?',
                confirmButtonText: 'Reconnect',
            });
            if (!reconnect) return;
        }

        await ctx.ui.notify('Opening browser for Supermemory authentication...');

        const result = await startAuthFlow((url) => ctx.system.open(url));

        if (result.success) {
            client = new SupermemoryClient(result.apiKey!);
            await ctx.ui.notify('✓ Supermemory connected successfully!');
        } else {
            await ctx.ui.notify(`✗ Authentication failed: ${result.error}`);
        }
    });

    amp.registerCommand('logout', {
        title: 'Logout',
        category: 'Supermemory',
        description: 'Disconnect from Supermemory',
    }, async (ctx) => {
        const confirmed = await ctx.ui.confirm({
            title: 'Logout from Supermemory',
            message: 'This will remove your saved credentials. Your memories will remain on the server.',
            confirmButtonText: 'Logout',
        });
        if (!confirmed) return;

        deleteCredentials();
        client = null;
        await ctx.ui.notify('Logged out from Supermemory.');
    });

    amp.registerCommand('status', {
        title: 'Status',
        category: 'Supermemory',
        description: 'Show Supermemory connection status and configuration',
    }, async (ctx) => {
        const apiKey = getApiKey(config);
        const connected = !!apiKey;
        const maskedKey = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : 'none';

        let cwd = process.cwd();
        const currentTags = generateTags(cwd, config);

        const status = [
            `Connected: ${connected ? '✓ Yes' : '✗ No'}`,
            `API Key: ${maskedKey}`,
            `User Tag: ${currentTags.user}`,
            `Project Tag: ${currentTags.project}`,
            `Profile Injection: ${config.injectProfile ? 'enabled' : 'disabled'}`,
            `Max Memories: ${config.maxMemories}`,
            `Max Project Memories: ${config.maxProjectMemories}`,
        ].join('\n');

        await ctx.ui.notify(status);
    });
}
