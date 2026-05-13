import { ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript'
import path from 'path'

import { AIEngine }       from './structures/AIEngine'
import { ForgeAIOptions } from './structures/types'

export class ForgeAI extends ForgeExtension {
    name        = 'ForgeAI'
    description = 'Multi-provider AI for ForgeScript — chat, conversations, RAG, MCP, model routing and fallback.'
    version     = require('../package.json').version as string

    /** The main AI engine — use this directly from TypeScript for full API access. */
    public engine!: AIEngine

    constructor(private readonly options: ForgeAIOptions) {
        super()
    }

    init(client: ForgeClient): void {
        this.engine = new AIEngine(this.options)
        this.load(path.join(__dirname, './functions'))

        const providerCount = this.engine.providers.getAll().length
        Logger.info(`[ForgeAI] v${this.version} ready — ${providerCount} provider(s) registered.`)
    }
}

export * from './structures'
