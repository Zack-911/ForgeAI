# ForgeAI

Multi-provider AI extension for ForgeScript. Adds chat, persistent conversations, RAG, MCP tool use, model routing and per-user/guild settings to your bot through simple functions.

> **ForgeAI requires [ForgeDB](https://github.com/tryforge/ForgeDB) to be installed and listed before ForgeAI in your extensions array.**

---

## Contents

1. [Installation](#installation)
2. [Basic Setup](#basic-setup)
3. [Providers](#providers)
4. [Model Strings and Routes](#model-strings-and-routes)
5. [Chat Functions](#chat-functions)
6. [Conversations](#conversations)
7. [Settings](#settings)
8. [RAG](#rag)
9. [MCP](#mcp)

---

## Installation

```bash
npm install github:zack-911/forgeai
```

---

## Basic Setup

```js
const { ForgeClient } = require("@tryforge/forgescript")
const { ForgeDB } = require("@tryforge/forge.db")
const { ForgeAI } = require("forgeai")

const ai = new ForgeAI({
    providers: {
        openai: { apiKey: "your-openai-key" },
    },
    defaultModel: "openai:gpt-4o-mini",
    defaultSystemPrompt: "You are a helpful Discord bot assistant.",
    persistence: { enabled: true },
})

const client = new ForgeClient({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    events: ["messageCreate"],
    prefixes: ["!"],
    // ForgeDB must come before ForgeAI
    extensions: [new ForgeDB(), ai],
})

client.commands.add({
    name: "ask",
    type: "messageCreate",
    code: `$aiChat[$message]`,
})

client.login("your-bot-token")
```

---

## Providers

Pass provider configs under the `providers` key. Any provider you leave out is simply not registered.

```js
const ai = new ForgeAI({
    providers: {
        // OpenAI
        openai: { apiKey: "sk-..." },

        // Anthropic
        anthropic: { apiKey: "sk-ant-..." },

        // Google Gemini
        gemini: { apiKey: "AIza..." },

        // Ollama (local, no key needed)
        ollama: { host: "http://localhost:11434" },

        // DeepSeek
        deepseek: { apiKey: "..." },

        // Any OpenAI-compatible endpoint
        custom: [
            { id: "myhost", baseURL: "http://localhost:8000/v1", apiKey: "optional" }
        ],
    },
    defaultModel: "openai:gpt-4o-mini",
})
```

---

## Model Strings and Routes

Models are referenced as `provider:model`, for example `openai:gpt-4o`, `anthropic:claude-opus-4`, `ollama:llama3`.

You can define named routes with fallback chains. If the first model in a route fails, the next one is tried automatically.

```js
const ai = new ForgeAI({
    providers: { ... },
    defaultModel: "openai:gpt-4o-mini",

    routes: {
        fast:  { models: ["openai:gpt-4o-mini", "gemini:gemini-2.0-flash"] },
        smart: { models: ["openai:gpt-4o", "anthropic:claude-opus-4"] },
        local: { models: ["ollama:llama3"] },
    },

    // Global fallback if the resolved model fails
    fallback: ["openai:gpt-4o-mini"],
})
```

Use a route name anywhere a model string is accepted:

```
$aiChatRaw[$message;fast]
```

You can also define or update routes at runtime with `$aiSetRoute`:

```
$aiSetRoute[fast;openai:gpt-4o-mini;gemini:gemini-2.0-flash]
```

---

## Chat Functions

### `$aiChat[prompt;convId?;model?]`

Sends a message and maintains conversation history. If no `convId` is given it auto-creates a conversation scoped to the current user, guild and channel.

```
$aiChat[$message]
$aiChat[$message;$let[id;$aiGetConvId[$authorID;;$channelID]]$get[id]]
$aiChat[$message;;anthropic:claude-haiku-4-5]
```

### `$aiChatRaw[prompt;model?;systemPrompt?]`

One-shot chat with no conversation history. Every call is stateless.

```
$aiChatRaw[$message]
$aiChatRaw[$message;smart]
$aiChatRaw[$message;;Translate to French. Reply only with the translation.]
```

### `$aiLastConvId`

Returns the conversation ID used in the most recent `$aiChat` call.

### `$aiLastModel`

Returns the model that was actually used in the most recent call (useful when routing/fallback is involved).

### `$aiLastTokens`

Returns the total token count from the most recent call.

---

## Conversations

Conversations store message history and can be scoped to a user, guild and channel. They persist across restarts when `persistence: { enabled: true }` is set.

```
// Create a new conversation
$aiNewConversation[$authorID;$guildID;$channelID]

// Find an existing conversation for the current scope
$aiGetConvId[$authorID;;$channelID]

// Read history as text or raw JSON
$aiConvHistory[convId;text]
$aiConvHistory[convId;json]

// Read a specific property
$aiConvInfo[convId;model]
$aiConvInfo[convId;messageCount]
$aiConvInfo[convId;systemPrompt]

// Modify conversation settings
$aiSetConvModel[convId;openai:gpt-4o]
$aiSetConvSystemPrompt[convId;You are a pirate.]
$aiSetConvTemperature[convId;0.9]

// Clear history without deleting the conversation
$aiClearConversation[convId]

// Delete a conversation
$aiDeleteConversation[convId]

// Delete all conversations belonging to a user
$aiDeleteAllConversations[$authorID]
```

Example: per-user persistent chat with a reset command.

```js
client.commands.add({
    name: "chat",
    type: "messageCreate",
    code: `
        $onlyIf[$message!=;Provide a message.]
        $let[id;$aiGetConvId[$authorID;;$channelID]]
        $if[$get[id];;$let[id;$aiNewConversation[$authorID;$guildID;$channelID]]]
        $aiChat[$message;$get[id]]
    `,
})

client.commands.add({
    name: "clearchat",
    type: "messageCreate",
    code: `
        $let[id;$aiGetConvId[$authorID;;$channelID]]
        $if[$get[id];$aiClearConversation[$get[id]];Nothing to clear.]
        Conversation cleared.
    `,
})
```

---

## Settings

Settings follow a priority order: conversation override > user setting > channel config > guild setting > global default.

When `systemPromptMode` is set to `append`, all levels are concatenated instead of the most specific one winning.

### User settings

```
$aiSetUserModel[$message]
$aiSetUserSystemPrompt[$message]
$aiSetUserTemperature[0.5]
$aiSetUserMaxHistory[20]
$aiSetUserMaxTokens[1024]
$aiGetUserSetting[model]
$aiGetUserSetting[systemPrompt]
$aiResetUserSettings
```

### Guild settings

```
$aiSetGuildModel[$message]
$aiSetGuildSystemPrompt[$message]
$aiSetGuildMaxHistory[30]
$aiResetGuildSettings
```

### Channel settings

```
$aiSetChannelModel[$message]
$aiSetChannelSystemPrompt[$message]
$aiSetChannelEnabled[true]
$aiSetChannelEnabled[false;$channelID]
```

---

## RAG

RAG (retrieval-augmented generation) lets you feed a knowledge base to the AI so it can answer questions from your own documents. Enable it in the constructor and use the `$aiRag*` functions to manage the store.

```js
const ai = new ForgeAI({
    providers: { openai: { apiKey: "..." } },
    defaultModel: "openai:gpt-4o-mini",
    rag: {
        enabled: true,
        embedModel: "openai:text-embedding-3-small", // omit to use keyword search
        topK: 3,
        minSimilarity: 0.65,
    },
})
```

When RAG is enabled, relevant documents are automatically injected into the system prompt before each chat request.

```
// Add a document
$aiRagAdd[The server rules are: no spam, no NSFW content.]
$aiRagAdd[Server history...;lore]

// Add multiple documents at once (semicolon-separated)
$aiRagAddBatch[doc one;doc two;doc three]

// Search manually
$aiRagSearch[what are the rules;default;5]

// Manage the store
$aiRagCount
$aiRagNamespaces
$aiRagDelete[documentId]
$aiRagClear[namespace]
```

---

## MCP

MCP (Model Context Protocol) lets the AI call external tools at inference time. Register servers either in the constructor or at runtime.

```js
const ai = new ForgeAI({
    mcp: {
        autoInject: true, // inject tools into every request automatically
        servers: [
            { id: "my-tools", url: "http://localhost:3000/mcp", enabled: true },
        ],
    },
})
```

```
// Register a server at runtime
$aiMcpAddServer[my-tools;http://localhost:3000/mcp]

// Enable / disable a server without removing it
$aiMcpEnableServer[my-tools]
$aiMcpDisableServer[my-tools]

// Remove a server
$aiMcpRemoveServer[my-tools]

// Fetch available tools from all enabled servers and cache them
$aiMcpFetchTools

// List registered servers or cached tools as JSON
$aiMcpListServers
$aiMcpListTools

// Call a tool directly
$aiMcpCallTool[my-tools;toolName;{"arg":"value"}]
```