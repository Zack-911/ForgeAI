/**
 * Built-in provider IDs. You can also pass a custom string for any
 * OpenAI-compatible endpoint — just configure it in providers.custom.
 */
export type BuiltinProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'deepseek' | 'openllm' | 'kiwi';
export type ProviderID = BuiltinProvider | string;
/**
 * A model string in `provider:model` format.
 * Examples: `openai:gpt-4o`, `anthropic:claude-opus-4`, `ollama:llama3`
 *
 * Or a named route: `fast`, `smart`, `local`, `vision`, `cheap`
 */
export type ModelString = string;
export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';
export interface ChatMessage {
    role: MessageRole;
    content: string;
    timestamp: number;
    model?: string;
    tokens?: number;
}
export interface Conversation {
    id: string;
    userID?: string;
    guildID?: string;
    channelID?: string;
    messages: ChatMessage[];
    systemPrompt: string | null;
    model: string | null;
    temperature: number | null;
    maxTokens: number | null;
    createdAt: number;
    updatedAt: number;
}
export interface RAGDocument {
    id: string;
    content: string;
    namespace: string;
    metadata: Record<string, string>;
    embedding: number[] | null;
    createdAt: number;
}
export interface RAGSearchResult {
    document: RAGDocument;
    similarity: number;
}
export interface MCPServerConfig {
    id: string;
    url: string;
    name?: string;
    apiKey?: string;
    enabled: boolean;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    serverId: string;
}
export interface OpenAICompatConfig {
    apiKey?: string;
    baseURL?: string;
}
export interface AnthropicConfig {
    apiKey: string;
}
export interface GeminiConfig {
    apiKey: string;
}
export interface OllamaConfig {
    host?: string;
}
export interface CustomProviderConfig extends OpenAICompatConfig {
    id: string;
    name?: string;
}
export interface RouteDefinition {
    /** Ordered list of model strings to try. First available wins. */
    models: ModelString[];
    /** Optional description for documentation. */
    description?: string;
}
export interface UserSettings {
    userID: string;
    model: string | null;
    systemPrompt: string | null;
    maxHistory: number | null;
    temperature: number | null;
    maxTokens: number | null;
    extra: Record<string, string>;
}
export interface GuildSettings {
    guildID: string;
    model: string | null;
    systemPrompt: string | null;
    maxHistory: number | null;
    temperature: number | null;
    maxTokens: number | null;
    allowedModels: string[];
    blockedModels: string[];
    channelConfig: Record<string, ChannelConfig>;
    extra: Record<string, string>;
}
export interface ChannelConfig {
    model?: string;
    systemPrompt?: string;
    enabled?: boolean;
}
export interface ForgeAIOptions {
    providers?: {
        openai?: OpenAICompatConfig;
        anthropic?: AnthropicConfig;
        gemini?: GeminiConfig;
        ollama?: OllamaConfig;
        deepseek?: OpenAICompatConfig;
        openllm?: OpenAICompatConfig;
        kiwi?: OpenAICompatConfig;
        /** Any additional OpenAI-compatible providers. */
        custom?: CustomProviderConfig[];
    };
    /**
     * Default model used when no user/guild/conversation setting is found.
     * Format: `provider:model` e.g. `openai:gpt-4o-mini`
     */
    defaultModel?: ModelString;
    /**
     * Global default system prompt.
     * Applied when no user/guild/conversation system prompt is set.
     */
    defaultSystemPrompt?: string;
    /**
     * How system prompts at different levels are combined.
     * - `replace` — each level fully replaces the one below (conversation > user > guild > global)
     * - `append`  — prompts are concatenated (global + guild + user + conversation)
     * Default: `replace`
     */
    systemPromptMode?: 'replace' | 'append';
    /**
     * Named model routes. Each route is an ordered list of model strings.
     * If the first model fails, the next is tried automatically.
     *
     * Built-in route names: fast, smart, local, vision, cheap
     * You can define your own.
     */
    routes?: Record<string, RouteDefinition | ModelString[]>;
    /**
     * Global fallback chain. If the resolved model fails and has no route,
     * these models are tried in order.
     */
    fallback?: ModelString[];
    maxHistory?: number;
    temperature?: number;
    maxTokens?: number;
    persistence?: {
        enabled: boolean;
        /** Folder to store the SQLite database. Default: ./ai-data */
        folder?: string;
    };
    rag?: {
        enabled: boolean;
        /**
         * Model to use for generating embeddings.
         * Format: `provider:model` e.g. `openai:text-embedding-3-small`
         * If not set, falls back to keyword search (BM25).
         */
        embedModel?: ModelString;
        /** Number of documents to inject per query. Default: 3 */
        topK?: number;
        /** Minimum similarity score (0-1) to include a document. Default: 0.7 */
        minSimilarity?: number;
    };
    mcp?: {
        servers?: MCPServerConfig[];
        /** Whether to auto-inject MCP tools into every chat request. Default: true */
        autoInject?: boolean;
    };
}
export interface ChatOptions {
    model?: ModelString;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    /** Inject RAG context for this request. Default: follows global RAG config */
    useRAG?: boolean;
    ragNamespace?: string;
    /** Use MCP tools for this request. Default: follows global MCP config */
    useMCP?: boolean;
    /** Stream the response. Returns AsyncIterable<string>. Not yet surfaced as $function. */
    stream?: boolean;
    /** Extra stop sequences */
    stop?: string[];
}
export interface ProviderResponse {
    content: string;
    model: string;
    inputTokens?: number;
    outputTokens?: number;
    finishReason?: string;
    toolCalls?: ToolCall[];
}
export interface ToolCall {
    id: string;
    toolName: string;
    arguments: Record<string, unknown>;
}
//# sourceMappingURL=types.d.ts.map