# amp-supermemory

Persistent memory plugin for [Amp](https://ampcode.com) using [Supermemory](https://supermemory.ai).

Your agent remembers what you worked on — across sessions, across projects.

## Install

> **Note:** The Amp plugin API is experimental. Installation is manual for now.

**Step 1:** Copy the plugin to your Amp plugins directory:

```bash
# Global (all projects)
mkdir -p ~/.config/amp/plugins
curl -o ~/.config/amp/plugins/supermemory.js \
  https://raw.githubusercontent.com/zaengerlein/amp-supermemory/main/dist/supermemory.js

# Or project-level
mkdir -p .amp/plugins
curl -o .amp/plugins/supermemory.js \
  https://raw.githubusercontent.com/zaengerlein/amp-supermemory/main/dist/supermemory.js
```

**Step 2:** Run Amp with plugins enabled:

```bash
PLUGINS=all amp
```

**Step 3:** Get your API key from [app.supermemory.ai](https://app.supermemory.ai/?view=integrations) and either:

```bash
export SUPERMEMORY_API_KEY="sm_..."
```

Or use the built-in login — press `Ctrl+O` and select **Supermemory: Login** to authenticate via browser.

## How It Works

**Auto-Recall** — On the first message of each session, Supermemory fetches your user profile, relevant memories, and project knowledge, then injects them into the conversation context. No action needed.

**Auto-Capture** — When a session ends, the conversation is sent to Supermemory for long-term storage.

**Privacy** — Wrap sensitive content in `<private>` tags to prevent it from being stored:

```
My API key is <private>sk-abc123</private>
```

## Features

- **Context injection** — relevant memories loaded at the start of each session
- **Save & search** — explicitly save important knowledge or search past memories
- **User + project scoping** — personal memories follow you; project memories are shared with your team
- **Profile building** — Supermemory automatically builds a profile of your preferences and patterns
- **OAuth login** — authenticate via browser in seconds

## Tool

The `supermemory` tool is available to the agent:

| Mode | Description |
|------|-------------|
| `save` | Save knowledge to memory (`user` or `project` scope) |
| `search` | Semantic search across memories |
| `profile` | View auto-built preference profile |
| `list` | List recent stored memories |
| `forget` | Delete a specific memory by ID |

The agent uses this tool proactively when you ask it to remember something, when it discovers important patterns, or when you tell it to save a decision.

**Examples:**

- *"Remember that this project uses 4-space indentation"*
- *"Save to project memory: we use Zustand for state management"*
- *"Search my memories for how we handled auth last time"*

## Commands

Press `Ctrl+O` to access:

| Command | Description |
|---------|-------------|
| **Supermemory: Login** | Authenticate with Supermemory |
| **Supermemory: Logout** | Remove credentials |
| **Supermemory: Status** | Show connection status and config |

## Configuration

Set API key via environment variable:

```bash
export SUPERMEMORY_API_KEY="sm_..."
```

Or create `~/.supermemory-amp/config.json`:

```json
{
  "apiKey": "sm_...",
  "similarityThreshold": 0.6,
  "maxMemories": 5,
  "maxProjectMemories": 10,
  "maxProfileItems": 5,
  "injectProfile": true,
  "containerTagPrefix": "amp",
  "userContainerTag": "custom_user_tag",
  "projectContainerTag": "custom_project_tag"
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | — | Supermemory API key |
| `similarityThreshold` | `0.6` | Min similarity for memory retrieval (0–1) |
| `maxMemories` | `5` | Max user memories per context injection |
| `maxProjectMemories` | `10` | Max project memories to include |
| `maxProfileItems` | `5` | Max profile facts to inject |
| `injectProfile` | `true` | Include profile in context |
| `containerTagPrefix` | `"amp"` | Prefix for auto-generated container tags |
| `userContainerTag` | — | Override auto-generated user tag |
| `projectContainerTag` | — | Override auto-generated project tag |

All fields optional. Env var `SUPERMEMORY_API_KEY` takes precedence over config file.

## Memory Scoping

| Scope | Tag | Persists |
|-------|-----|----------|
| User | `amp_user_{sha256(git email)}` | All projects |
| Project | `amp_project_{git remote name}` | This project |

Custom container tags let you share memories across team members or sync between machines.

## Development

```bash
git clone https://github.com/zaengerlein/amp-supermemory.git
cd amp-supermemory
npm install
npm run build
# Output: dist/supermemory.js
```

## License

MIT
