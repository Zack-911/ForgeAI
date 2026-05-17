export declare class AIUserSettings {
    userID: string;
    data: string;
}
export declare class MongoAIUserSettings extends AIUserSettings {
    mongoId?: string;
}
export declare class AIGuildSettings {
    guildID: string;
    data: string;
}
export declare class MongoAIGuildSettings extends AIGuildSettings {
    mongoId?: string;
}
export declare class AIRAGDocument {
    id: string;
    content: string;
    namespace: string;
    metadata: string;
    embedding: string | null;
    createdAt: number;
}
export declare class MongoAIRAGDocument extends AIRAGDocument {
    mongoId?: string;
}
export declare class AIConversation {
    id: string;
    userID?: string;
    guildID?: string;
    channelID?: string;
    messages: string;
    systemPrompt?: string | null;
    model?: string | null;
    temperature?: number | null;
    maxTokens?: number | null;
    createdAt: number;
    updatedAt: number;
}
export declare class MongoAIConversation extends AIConversation {
    mongoId?: string;
}
//# sourceMappingURL=entities.d.ts.map