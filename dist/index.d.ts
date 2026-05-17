import { ForgeClient, ForgeExtension } from '@tryforge/forgescript';
import { AIEngine } from './structures/AIEngine';
import { AIDatabase } from './structures/database/AIDatabase';
import { ForgeAIOptions } from './structures/types';
export declare class ForgeAI extends ForgeExtension {
    private readonly options;
    name: string;
    description: string;
    version: string;
    requireExtensions: string[];
    engine: AIEngine;
    db: AIDatabase;
    constructor(options: ForgeAIOptions);
    init(client: ForgeClient): Promise<void>;
}
export * from './structures';
export * from './structures/database/AIDatabase';
export * from './structures/database/entities';
//# sourceMappingURL=index.d.ts.map