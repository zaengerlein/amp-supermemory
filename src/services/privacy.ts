const SECRET_PATTERNS: [RegExp, string][] = [
    // API keys & tokens (common prefixes)
    [/\b(sk-[a-zA-Z0-9]{20,})\b/g, '[REDACTED_API_KEY]'],
    [/\b(sm_[a-zA-Z0-9]{10,})\b/g, '[REDACTED_SM_KEY]'],
    [/\b(ghp_[a-zA-Z0-9]{36,})\b/g, '[REDACTED_GITHUB_TOKEN]'],
    [/\b(gho_[a-zA-Z0-9]{36,})\b/g, '[REDACTED_GITHUB_TOKEN]'],
    [/\b(ghu_[a-zA-Z0-9]{36,})\b/g, '[REDACTED_GITHUB_TOKEN]'],
    [/\b(github_pat_[a-zA-Z0-9_]{20,})\b/g, '[REDACTED_GITHUB_TOKEN]'],
    [/\b(xoxb-[a-zA-Z0-9-]{20,})\b/g, '[REDACTED_SLACK_TOKEN]'],
    [/\b(xoxp-[a-zA-Z0-9-]{20,})\b/g, '[REDACTED_SLACK_TOKEN]'],
    [/\b(xapp-[a-zA-Z0-9-]{20,})\b/g, '[REDACTED_SLACK_TOKEN]'],
    [/\b(sk-ant-[a-zA-Z0-9-]{20,})\b/g, '[REDACTED_ANTHROPIC_KEY]'],
    [/\b(AIza[a-zA-Z0-9_-]{30,})\b/g, '[REDACTED_GOOGLE_KEY]'],
    [/\b(AKIA[A-Z0-9]{16})\b/g, '[REDACTED_AWS_KEY]'],
    [/\b(np_[a-zA-Z0-9]{20,})\b/g, '[REDACTED_NPM_TOKEN]'],
    [/\b(pypi-[a-zA-Z0-9]{20,})\b/g, '[REDACTED_PYPI_TOKEN]'],
    [/\b(glpat-[a-zA-Z0-9_-]{20,})\b/g, '[REDACTED_GITLAB_TOKEN]'],

    // Bearer tokens in headers
    [/(Authorization:\s*Bearer\s+)[^\s"']+/gi, '$1[REDACTED_TOKEN]'],

    // Passwords in connection strings / env vars
    [/((?:password|passwd|pwd|secret|token|api_key|apikey|api-key|access_key|private_key)\s*[:=]\s*['"]?)[^\s'"}\]]+/gi, '$1[REDACTED]'],

    // Connection strings with embedded credentials
    [/((?:mongodb|postgres|mysql|redis|amqp|smtp):\/\/[^:]+:)[^@]+(@)/gi, '$1[REDACTED]$2'],

    // Private keys
    [/-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]'],

    // JWTs (3 base64 segments separated by dots, each segment 10+ chars)
    [/\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/g, '[REDACTED_JWT]'],
];

export function stripPrivateContent(content: string): string {
    // Strip injected supermemory context so we don't save our own context back
    let result = content.replace(/<supermemory-context>[\s\S]*?<\/supermemory-context>/gi, '');

    // Strip explicit <private> tags
    result = result.replace(/<private>[\s\S]*?<\/private>/gi, '[REDACTED]');

    // Then auto-detect common secrets
    for (const [pattern, replacement] of SECRET_PATTERNS) {
        result = result.replace(pattern, replacement);
    }

    return result;
}
