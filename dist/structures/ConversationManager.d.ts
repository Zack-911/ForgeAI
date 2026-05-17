import { Conversation, ChatMessage } from './types';
export declare class ConversationManager {
    private memory;
    private persistent;
    constructor(enabled?: boolean);
    create(opts?: Partial<Pick<Conversation, 'userID' | 'guildID' | 'channelID' | 'systemPrompt' | 'model'>>): Promise<Conversation>;
    get(id: string): Promise<Conversation | null>;
    /** Find a conversation by scope. Returns the most recently updated match. */
    findByScope(scope: {
        userID?: string;
        guildID?: string;
        channelID?: string;
    }): Promise<Conversation | null>;
    listByUser(userID: string, guildID?: string): Promise<Conversation[]>;
    addMessage(id: string, message: ChatMessage, maxHistory?: number): Promise<Conversation | null>;
    update(id: string, patch: Partial<Pick<Conversation, 'systemPrompt' | 'model' | 'temperature' | 'maxTokens'>>): Promise<Conversation | null>;
    clear(id: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    deleteByScope(scope: {
        userID?: string;
        guildID?: string;
    }): Promise<number>;
    count(): Promise<number>;
    private _save;
    private _deserialize;
}
//# sourceMappingURL=ConversationManager.d.ts.map