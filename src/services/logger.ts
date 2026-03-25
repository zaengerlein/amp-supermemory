import { appendFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const LOG_DIR = join(homedir(), '.supermemory-amp');
const LOG_FILE = join(LOG_DIR, 'debug.log');

function ensureLogDir(): void {
    if (!existsSync(LOG_DIR)) {
        mkdirSync(LOG_DIR, { recursive: true, mode: 0o700 });
    }
}

export function log(tag: string, ...args: unknown[]): void {
    try {
        ensureLogDir();
        const timestamp = new Date().toISOString();
        const message = args
            .map((a) => (typeof a === 'string' ? a : JSON.stringify(a, null, 2)))
            .join(' ');
        appendFileSync(LOG_FILE, `[${timestamp}] ${tag} ${message}\n`);
    } catch {
        // Don't let logging errors break the plugin
    }
}
