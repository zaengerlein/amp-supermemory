import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import type { ContainerTags, SupermemoryConfig } from '../types';

function sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
}

function getGitRoot(cwd: string): string | null {
    try {
        return execSync('git rev-parse --show-toplevel', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
    } catch {
        return null;
    }
}

function getGitEmail(): string | null {
    try {
        return execSync('git config user.email', {
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
    } catch {
        return null;
    }
}

function getGitRemoteName(cwd: string): string | null {
    try {
        const remote = execSync('git remote get-url origin', {
            cwd,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        // Extract repo name from URL
        const match = remote.match(/\/([^/]+?)(?:\.git)?$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

export function generateTags(cwd: string, config: SupermemoryConfig): ContainerTags {
    const prefix = config.containerTagPrefix || 'amp';

    // User tag
    let userTag: string;
    if (config.userContainerTag) {
        userTag = config.userContainerTag;
    } else {
        const email = getGitEmail();
        const identifier = email || cwd;
        userTag = `${prefix}_user_${sha256(identifier).slice(0, 16)}`;
    }

    // Project tag
    let projectTag: string;
    if (config.projectContainerTag) {
        projectTag = config.projectContainerTag;
    } else {
        const gitRoot = getGitRoot(cwd);
        const remoteName = getGitRemoteName(cwd);
        if (remoteName) {
            const sanitized = remoteName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
            projectTag = `${prefix}_project_${sanitized}`;
        } else {
            const dir = gitRoot || cwd;
            projectTag = `${prefix}_project_${sha256(dir).slice(0, 16)}`;
        }
    }

    return { user: userTag, project: projectTag };
}
