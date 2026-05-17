import { RAGDocument, RAGSearchResult } from './types';
export declare class RAGManager {
    private readonly topK;
    private readonly minSimilarity;
    private embedFn;
    constructor(topK?: number, minSimilarity?: number);
    setEmbedFunction(fn: (text: string) => Promise<number[]>): void;
    add(content: string, namespace?: string, metadata?: Record<string, string>): Promise<RAGDocument>;
    addBatch(items: {
        content: string;
        namespace?: string;
        metadata?: Record<string, string>;
    }[]): Promise<number>;
    delete(id: string): Promise<boolean>;
    deleteByNamespace(namespace: string): Promise<number>;
    count(namespace?: string): Promise<number>;
    listNamespaces(): Promise<string[]>;
    search(query: string, namespace?: string, topK?: number, minSimilarity?: number): Promise<RAGSearchResult[]>;
    private _vectorSearch;
    private _keywordSearch;
    private _cosineSimilarity;
    private _deserialize;
    /** Format search results as a context string for injection into prompts. */
    static formatContext(results: RAGSearchResult[]): string;
}
//# sourceMappingURL=RAGManager.d.ts.map