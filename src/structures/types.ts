// ─── Provider identifiers ─────────────────────────────────────────────────────

/**
 * Built-in provider IDs. You can also pass a custom string for any
 * OpenAI-compatible endpoint — just configure it in providers.custom.
 */
export type BuiltinProvider =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'ollama'
  | 'deepseek'
  | 'openllm'
  | 'kiwi';

export type ProviderID = BuiltinProvider | string;

/**
 * A model string in `provider:model` format.
 * Examples: `openai:gpt-4o`, `anthropic:claude-opus-4`, `ollama:llama3`
 *
 * Or a named route: `fast`, `smart`, `local`, `vision`, `cheap`
 */
export type ModelString = string;

// ─── Messages ─────────────────────────────────────────────────────────────────

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
  model?: string; // which model generated this (for assistant messages)
  tokens?: number; // approximate tokens used
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  userID?: string;
  guildID?: string;
  channelID?: string;
  messages: ChatMessage[];
  systemPrompt: string | null;
  model: string | null; // per-conversation model override
  temperature: number | null;
  maxTokens: number | null;
  createdAt: number;
  updatedAt: number;
}

// ─── RAG ──────────────────────────────────────────────────────────────────────

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

// ─── MCP ──────────────────────────────────────────────────────────────────────

export interface MCPServerConfig {
  id: string;
  url: string; // HTTP endpoint e.g. http://localhost:3000/mcp
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

// ─── Provider configs ─────────────────────────────────────────────────────────

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
  host?: string; // default: http://localhost:11434
}

export interface CustomProviderConfig extends OpenAICompatConfig {
  id: string;
  name?: string;
}

// ─── Route definitions ────────────────────────────────────────────────────────

export interface RouteDefinition {
  /** Ordered list of model strings to try. First available wins. */
  models: ModelString[];
  /** Optional description for documentation. */
  description?: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

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
  allowedModels: string[]; // empty = all allowed
  blockedModels: string[];
  channelConfig: Record<string, ChannelConfig>;
  extra: Record<string, string>;
}

export interface ChannelConfig {
  model?: string;
  systemPrompt?: string;
  enabled?: boolean;
}

// ─── Top-level ForgeAI options ────────────────────────────────────────────────

export interface ForgeAIOptions {
  // ── Providers ──────────────────────────────────────────────────────────────
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

  // ── Conversation defaults ──────────────────────────────────────────────────
  maxHistory?: number; // max messages kept per conversation (default: 40)
  temperature?: number; // default: 0.7
  maxTokens?: number; // default: 2048

  // ── Persistence ────────────────────────────────────────────────────────────
  persistence?: {
    enabled: boolean;
    /** Folder to store the SQLite database. Default: ./ai-data */
    folder?: string;
  };

  // ── RAG ───────────────────────────────────────────────────────────────────
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

  // ── MCP ───────────────────────────────────────────────────────────────────
  mcp?: {
    servers?: MCPServerConfig[];
    /** Whether to auto-inject MCP tools into every chat request. Default: true */
    autoInject?: boolean;
  };
}

// ─── Chat options (per-request overrides) ────────────────────────────────────

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

// ─── Provider response ────────────────────────────────────────────────────────

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
