import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { saveCredentials } from './config';

const AUTH_PORT = 19878;
const AUTH_TIMEOUT = 120_000; // 2 minutes
const AUTH_URL = process.env.SUPERMEMORY_AUTH_URL || 'https://app.supermemory.ai/auth/connect';
const AUTH_CLIENT = 'claude_code';

const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><title>Supermemory Connected</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff}
.card{text-align:center;padding:2rem;border-radius:12px;background:#1a1a1a;border:1px solid #333;max-width:400px}
h1{color:#22c55e;margin-bottom:0.5rem}p{color:#999}</style></head>
<body><div class="card"><h1>✓ Connected</h1><p>Supermemory is connected to Amp. You can close this tab.</p></div></body></html>`;

const ERROR_HTML = `<!DOCTYPE html>
<html><head><title>Connection Failed</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff}
.card{text-align:center;padding:2rem;border-radius:12px;background:#1a1a1a;border:1px solid #333;max-width:400px}
h1{color:#ef4444;margin-bottom:0.5rem}p{color:#999}</style></head>
<body><div class="card"><h1>✗ Failed</h1><p>Could not connect to Supermemory. Please try again.</p></div></body></html>`;

export interface AuthResult {
    success: boolean;
    apiKey?: string;
    error?: string;
}

export async function startAuthFlow(openUrl: (url: string | URL) => Promise<void>): Promise<AuthResult> {
    return new Promise((resolve) => {
        let resolved = false;

        const server = createServer((req: IncomingMessage, res: ServerResponse) => {
            if (resolved) return;

            const url = new URL(req.url || '/', `http://localhost:${AUTH_PORT}`);

            if (url.pathname === '/callback') {
                const apiKey = url.searchParams.get('apikey') || url.searchParams.get('apiKey') || url.searchParams.get('api_key');

                if (apiKey && apiKey.startsWith('sm_')) {
                    saveCredentials(apiKey);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(SUCCESS_HTML);
                    resolved = true;
                    server.close();
                    resolve({ success: true, apiKey });
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(ERROR_HTML);
                    resolved = true;
                    server.close();
                    resolve({ success: false, error: 'Invalid API key received' });
                }
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.listen(AUTH_PORT, async () => {
            const callbackUrl = `http://localhost:${AUTH_PORT}/callback`;
            const authUrl = `${AUTH_URL}?callback=${encodeURIComponent(callbackUrl)}&client=${AUTH_CLIENT}`;

            try {
                await openUrl(authUrl);
            } catch {
                resolved = true;
                server.close();
                resolve({ success: false, error: 'Could not open browser for authentication' });
            }
        });

        server.on('error', (err: Error) => {
            if (!resolved) {
                resolved = true;
                resolve({ success: false, error: `Auth server error: ${err.message}` });
            }
        });

        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                server.close();
                resolve({ success: false, error: 'Authentication timed out after 2 minutes' });
            }
        }, AUTH_TIMEOUT);
    });
}
