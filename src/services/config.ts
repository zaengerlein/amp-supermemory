import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { SupermemoryConfig, Credentials } from '../types';
import { DEFAULT_CONFIG } from '../types';

const CONFIG_DIR = join(homedir(), '.supermemory-amp');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');
const CREDENTIALS_FILE = join(CONFIG_DIR, 'credentials.json');

function ensureConfigDir(): void {
    if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
    }
}

export function loadConfig(): SupermemoryConfig {
    const config = { ...DEFAULT_CONFIG };

    try {
        if (existsSync(CONFIG_FILE)) {
            const raw = readFileSync(CONFIG_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            Object.assign(config, parsed);
        }
    } catch {
        // Use defaults
    }

    return config;
}

export function saveConfig(config: Partial<SupermemoryConfig>): void {
    ensureConfigDir();
    const existing = loadConfig();
    const merged = { ...existing, ...config };
    writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), { mode: 0o600 });
}

export function loadCredentials(): Credentials | null {
    try {
        if (existsSync(CREDENTIALS_FILE)) {
            const raw = readFileSync(CREDENTIALS_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        // No credentials
    }
    return null;
}

export function saveCredentials(apiKey: string): void {
    ensureConfigDir();
    const creds: Credentials = {
        apiKey,
        createdAt: new Date().toISOString(),
    };
    writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 });
}

export function deleteCredentials(): boolean {
    try {
        const { unlinkSync } = require('node:fs');
        if (existsSync(CREDENTIALS_FILE)) {
            unlinkSync(CREDENTIALS_FILE);
            return true;
        }
    } catch {
        // Ignore
    }
    return false;
}

export function getApiKey(config: SupermemoryConfig): string | null {
    // Priority: env var → config file → credentials file
    const envKey = process.env.SUPERMEMORY_API_KEY;
    if (envKey) return envKey;

    if (config.apiKey) return config.apiKey;

    const creds = loadCredentials();
    if (creds?.apiKey) return creds.apiKey;

    return null;
}
