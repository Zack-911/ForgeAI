import { ForgeClient } from '@tryforge/forgescript'
import { ForgeAI } from '..'

const ai = new ForgeAI({
    providers: {
        openai:    { apiKey: process.env.OPENAI_API_KEY },
        anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
        gemini:    { apiKey: process.env.GEMINI_API_KEY },
        ollama:    { host: 'http://localhost:11434' },
        deepseek:  { apiKey: process.env.DEEPSEEK_API_KEY },
    },

    // Default model — used when nothing more specific is set
    defaultModel: 'openai:gpt-4o-mini',

    // Global system prompt
    defaultSystemPrompt: 'You are a helpful Discord bot assistant. Be concise and friendly.',

    // How system prompts at different levels combine
    systemPromptMode: 'replace',  // 'replace' | 'append'

    // Named routes with fallback chains
    routes: {
        fast:   { models: ['openai:gpt-4o-mini', 'anthropic:claude-haiku-4-5', 'ollama:llama3.2'] },
        smart:  { models: ['anthropic:claude-opus-4-5', 'openai:gpt-4o', 'gemini:gemini-2.5-pro'] },
        local:  { models: ['ollama:llama3.2', 'ollama:mistral', 'openai:gpt-4o-mini'] },
        cheap:  { models: ['deepseek:deepseek-chat', 'openai:gpt-4o-mini', 'ollama:llama3.2'] },
    },

    // Global fallback if every candidate in a route fails
    fallback: ['openai:gpt-4o-mini'],

    // Conversation defaults
    maxHistory:  40,
    temperature: 0.7,
    maxTokens:   2048,

    // SQLite persistence for conversations and settings
    persistence: { enabled: true, folder: './ai-data' },

    // Local RAG with OpenAI embeddings
    rag: {
        enabled:       true,
        embedModel:    'openai:text-embedding-3-small',
        topK:          3,
        minSimilarity: 0.65,
    },

    // MCP servers
    mcp: {
        autoInject: false,  // only use MCP when explicitly requested
        servers: [
            // { id: 'my-mcp', url: 'http://localhost:3000/mcp', enabled: true },
        ],
    },
})

const client = new ForgeClient({
    token:      process.env.BOT_TOKEN,
    intents:    ['Guilds', 'GuildMessages', 'MessageContent'],
    prefixes:   ['!'],
    events:     ['messageCreate'],
    extensions: [ai],
})

// ─── Basic chat ────────────────────────────────────────────────────────────────

client.commands.add({
    name: 'ask',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a question.]
        $aiChat[$message]
    `,
})

// ─── One-shot with custom system prompt ────────────────────────────────────────

client.commands.add({
    name: 'translate',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide text to translate.]
        $aiChatRaw[$message;;Translate the user's message to French. Reply with only the translation.]
    `,
})

// ─── Named conversations ───────────────────────────────────────────────────────

client.commands.add({
    name: 'chat',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a message.]
        $let[convId;$aiGetConvId[$authorID;;$channelID]]
        $if[$get[convId];;$let[convId;$aiNewConversation[$authorID;$guildID;$channelID]]]
        $aiChat[$message;$get[convId]]
    `,
})

client.commands.add({
    name: 'clearchat',
    type: 'messageCreate',
    code: `
        $let[convId;$aiGetConvId[$authorID;;$channelID]]
        $if[$get[convId];$aiClearConversation[$get[convId]];Nothing to clear.]
        ✅ Conversation cleared!
    `,
})

client.commands.add({
    name: 'history',
    type: 'messageCreate',
    code: `
        $let[convId;$aiGetConvId[$authorID;;$channelID]]
        $if[$get[convId];$aiConvHistory[$get[convId];text];No conversation found.]
    `,
})

// ─── Route usage ───────────────────────────────────────────────────────────────

client.commands.add({
    name: 'smart',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a question.]
        $aiChatRaw[$message;smart]
        $c[Used: $aiLastModel — $aiLastTokens tokens]
    `,
})

client.commands.add({
    name: 'local',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a question.]
        $aiChatRaw[$message;local]
    `,
})

// ─── User personalisation ──────────────────────────────────────────────────────

client.commands.add({
    name: 'setmodel',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Usage: !setmodel provider:model]
        $aiSetUserModel[$message]
        ✅ Your default model is now **$message**.
    `,
})

client.commands.add({
    name: 'setsystem',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a system prompt.]
        $aiSetUserSystemPrompt[$message]
        ✅ System prompt set.
    `,
})

client.commands.add({
    name: 'mysettings',
    type: 'messageCreate',
    code: `
        **Your AI Settings**
        Model: $aiGetUserSetting[model]
        System prompt: $aiGetUserSetting[systemPrompt]
        Temperature: $aiGetUserSetting[temperature]
        Max history: $aiGetUserSetting[maxHistory]
    `,
})

client.commands.add({
    name: 'resetai',
    type: 'messageCreate',
    code: `
        $aiResetUserSettings
        $aiDeleteAllConversations[$authorID]
        ✅ AI settings and conversation history reset.
    `,
})

// ─── Guild admin ───────────────────────────────────────────────────────────────

client.commands.add({
    name: 'setguildmodel',
    type: 'messageCreate',
    code: `
        $onlyForUsers[;$botOwnerID]
        $aiSetGuildModel[$message]
        ✅ Guild default model: **$message**
    `,
})

client.commands.add({
    name: 'setguildsystem',
    type: 'messageCreate',
    code: `
        $onlyForUsers[;$botOwnerID]
        $aiSetGuildSystemPrompt[$message]
        ✅ Guild system prompt set.
    `,
})

client.commands.add({
    name: 'setchannel',
    type: 'messageCreate',
    code: `
        $onlyForUsers[;$botOwnerID]
        $onlyIf[$message!=;Usage: !setchannel provider:model]
        $aiSetChannelModel[$message]
        ✅ This channel will use **$message**.
    `,
})

// ─── RAG management ────────────────────────────────────────────────────────────

client.commands.add({
    name: 'ragadd',
    type: 'messageCreate',
    code: `
        $onlyForUsers[;$botOwnerID]
        $onlyIf[$message!=;❌ Provide content.]
        $let[id;$aiRagAdd[$message]]
        ✅ Added. ID: $get[id] — Total: $aiRagCount docs
    `,
})

client.commands.add({
    name: 'ragsearch',
    type: 'messageCreate',
    code: `
        $onlyIf[$message!=;❌ Provide a search query.]
        Results:
        $aiRagSearch[$message]
    `,
})

client.commands.add({
    name: 'ragstats',
    type: 'messageCreate',
    code: `
        📚 RAG Store
        Documents: $aiRagCount
        Namespaces: $aiRagNamespaces
    `,
})

// ─── Model/route info ──────────────────────────────────────────────────────────

client.commands.add({
    name: 'providers',
    type: 'messageCreate',
    code: `**Registered providers:** $aiListProviders`,
})

client.commands.add({
    name: 'routes',
    type: 'messageCreate',
    code: `**Named routes:** \`\`\`json\n$aiListRoutes\`\`\``,
})

// ─── MCP ───────────────────────────────────────────────────────────────────────

client.commands.add({
    name: 'mcpservers',
    type: 'messageCreate',
    code: `**MCP Servers:** \`\`\`json\n$aiMcpListServers\`\`\``,
})

client.commands.add({
    name: 'mcptools',
    type: 'messageCreate',
    code: `
        $aiMcpFetchTools
        **MCP Tools:** \`\`\`json\n$aiMcpListTools\`\`\`
    `,
})

client.login()
