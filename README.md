# Supermemory for Amp

Persistent memory across [Amp](https://ampcode.com) sessions using [Supermemory](https://supermemory.ai).

Amp remembers your preferences, coding patterns, architectural decisions, debugging insights, and project conventions — across sessions and projects.

## Features

- **Automatic context injection** — relevant memories are loaded at the start of each session
- **Save & search** — explicitly save important knowledge or search past memories
- **User + project scoping** — personal memories follow you across projects; project memories are shared with your team
- **Profile building** — Supermemory automatically builds a profile of your preferences and patterns
- **Privacy controls** — wrap sensitive content in `<private>` tags to prevent it from being stored
- **OAuth login** — authenticate via browser in seconds

## Install

1. Copy the plugin file to your Amp plugins directory:

```bash
# Global (all projects)
mkdir -p ~/.config/amp/plugins
curl -o ~/.config/amp/plugins/supermemory.js \
  https://raw.githubusercontent.com/supermemoryai/amp-supermemory/main/dist/supermemory.js

# Or project-level
mkdir -p .amp/plugins
curl -o .amp/plugins/supermemory.js \
  https://raw.githubusercontent.com/supermemoryai/amp-supermemory/main/dist/supermemory.js
```

2. Run Amp with plugins enabled:

```bash
PLUGINS=all amp
```

3. Log in to Supermemory:

Press `Ctrl-O` and select **Supermemory: Login** — a browser window will open for authentication.

Alternatively, set the `SUPERMEMORY_API_KEY` environment variable.

## Usage

### Automatic Context

On the first message of each session, Supermemory automatically fetches your profile, relevant memories, and project knowledge, then injects them into the conversation context. No action needed.

### Supermemory Tool

The agent has access to a `supermemory` tool with these modes:

| Mode | Description |
|------|-------------|
| `save` | Save knowledge to memory (user or project scope) |
| `search` | Semantic search across your memories |
| `profile` | View your auto-built preference profile |
| `list` | List recent stored memories |
| `forget` | Delete a specific memory by ID |

The agent will proactively use this tool when you ask it to remember something, when it discovers important patterns, or when you tell it to save a decision.

**Examples:**
- *"Remember that this project uses 4-space indentation"*
- *"Save to project memory: we use Zustand for state management"*
- *"Search my memories for how we handled auth last time"*
- *"What does my profile say about my preferences?"*

### Commands

Press `Ctrl-O` to access:

| Command | Description |
|---------|-------------|
| **Supermemory: Login** | Authenticate with Supermemory |
| **Supermemory: Logout** | Remove credentials |
| **Supermemory: Status** | Show connection status and config |

### Privacy

Wrap sensitive content in `<private>` tags to prevent it from being stored:

```
My API key is <private>sk-abc123</private>
```

This will be stored as: `My API key is [REDACTED]`

## Configuration

Create `~/.supermemory-amp/config.json`:

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

| Setting | Default | Description |
|---------|---------|-------------|
| `apiKey` | — | Supermemory API key (or use `SUPERMEMORY_API_KEY` env var) |
| `similarityThreshold` | `0.6` | Minimum similarity score for memory retrieval |
| `maxMemories` | `5` | Max user memories per context injection |
| `maxProjectMemories` | `10` | Max project memories to include |
| `maxProfileItems` | `5` | Max profile facts to inject |
| `injectProfile` | `true` | Whether to include your profile in context |
| `containerTagPrefix` | `"amp"` | Prefix for auto-generated container tags |
| `userContainerTag` | — | Override the auto-generated user tag |
| `projectContainerTag` | — | Override the auto-generated project tag |

**API key resolution order:** `SUPERMEMORY_API_KEY` env var → `config.json` → OAuth credentials

## Memory Scoping

- **User memories** — scoped to your git email hash, follow you across all projects
- **Project memories** — scoped to the git remote name, shared with anyone who works on the same repo

## Build from Source

```bash
git clone https://github.com/supermemoryai/amp-supermemory.git
cd amp-supermemory
npm install
npm run build
# Output: dist/supermemory.js
```

## License

MIT
