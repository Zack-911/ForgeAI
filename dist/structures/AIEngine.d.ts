import { ProviderRegistry } from './ProviderRegistry';
import { ModelRouter } from './ModelRouter';
import { ConversationManager } from './ConversationManager';
import { SettingsManager } from './SettingsManager';
import { RAGManager } from './RAGManager';
import { MCPManager } from './MCPManager';
import { ForgeAIOptions, ChatOptions } from './types';
export interface EngineScope {
    userID?: string;
    guildID?: string;
    channelID?: string;
}
export interface ChatResult {
    content: string;
    model: string;
    convID: string | null;
    inputTokens?: number;
    outputTokens?: number;
}
export declare class AIEngine {
    readonly providers: ProviderRegistry;
    readonly router: ModelRouter;
    readonly conversations: ConversationManager;
    readonly settings: SettingsManager;
    readonly rag: RAGManager;
    readonly mcp: MCPManager;
    private readonly opts;
    private readonly ragEnabled;
    private readonly mcpAutoInject;
    constructor(options: ForgeAIOptions);
    private _initProviders;
    /**
     * One-shot chat. No conversation history — just prompt → response.
     */
    chat(prompt: string, scope?: EngineScope, options?: ChatOptions): Promise<ChatResult>;
    /**
     * Conversation-aware chat. Creates or continues a conversation by ID.
     * If no convID is given and autoCreate is true, creates one scoped to the provided scope.
     */
    chatInConversation(prompt: string, convID: string | null, scope?: EngineScope, options?: ChatOptions, autoCreate?: boolean): Promise<ChatResult>;
    private _buildMessages;
    private _resolveModel;
    private _resolveSystemPrompt;
}
//# sourceMappingURL=AIEngine.d.ts.map