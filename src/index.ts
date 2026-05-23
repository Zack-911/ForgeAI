import { ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript';
import path from 'path';

import { AIEngine } from './structures/AIEngine';
import { AIDatabase } from './structures/database/AIDatabase';
import { ForgeAIOptions } from './structures/types';

export class ForgeAI extends ForgeExtension {
  name = 'ForgeAI';
  description =
    'Multi-provider AI for ForgeScript. Chat, conversations, RAG, MCP, model routing and fallback.';
  version = require('../package.json').version as string;
  requireExtensions = ['forge.db'];

  public engine!: AIEngine;
  public db!: AIDatabase;

  constructor(private readonly options: ForgeAIOptions) {
    super();
  }

  async init(client: ForgeClient): Promise<void> {
    this.db = new AIDatabase();

    this.load(path.join(__dirname, './functions'));

    try {
      await this.db.init();
      Logger.info(`[ForgeAI] Connected to database.`);
    } catch (err: any) {
      Logger.error(`[ForgeAI] Failed to connect to database: ${err.message}`);
    }

    this.engine = new AIEngine(this.options);

    const providerCount = this.engine.providers.getAll().length;
    Logger.info(
      `[ForgeAI] v${this.version} ready — ${providerCount} provider(s) registered.`,
    );
  }
}

export * from './structures';
export * from './structures/database/AIDatabase';
export * from './structures/database/entities';
