import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { ProviderRegistry }    from './ProviderRegistry'
import { ModelRouter }         from './ModelRouter'
import { ConversationManager } from './ConversationManager'
import { SettingsManager }     from './SettingsManager'
import { RAGManager }          from './RAGManager'
import { MCPManager }          from './MCPManager'
import { OpenAICompatProvider } from './providers/OpenAICompatProvider'

import {
    ForgeAIOptions, ChatOptions, ChatMessage, ProviderResponse,
    Conversation, ModelString,
} from './types'

export interface EngineScope {
    userID?:    string
    guildID?:   string
    channelID?: string
}

export interface ChatResult {
    content:    string
    model:      string
    convID:     string | null
    inputTokens?:  number
    outputTokens?: number
}

export class AIEngine {
    readonly providers:    ProviderRegistry
    readonly router:       ModelRouter
    readonly conversations: ConversationManager
    readonly settings:     SettingsManager
    readonly rag:          RAGManager
    readonly mcp:          MCPManager

    private readonly opts: Required<Pick<ForgeAIOptions, 'defaultModel' | 'defaultSystemPrompt' | 'systemPromptMode' | 'maxHistory' | 'temperature' | 'maxTokens'>>
    private readonly ragEnabled:  boolean
    private readonly mcpAutoInject: boolean

    constructor(options: ForgeAIOptions) {
        // ── Defaults ──────────────────────────────────────────────────────────
        this.opts = {
            defaultModel:       options.defaultModel       ?? 'openai:gpt-4o-mini',
            defaultSystemPrompt: options.defaultSystemPrompt ?? '',
            systemPromptMode:   options.systemPromptMode   ?? 'replace',
            maxHistory:         options.maxHistory         ?? 40,
            temperature:        options.temperature        ?? 0.7,
            maxTokens:          options.maxTokens          ?? 2048,
        }

        // ── DB ────────────────────────────────────────────────────────────────
        const folder = options.persistence?.folder ?? './ai-data'
        if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
        const db = new Database(join(folder, 'forge.ai.db'))

        // ── Managers ──────────────────────────────────────────────────────────
        this.providers     = new ProviderRegistry()
        this.conversations = new ConversationManager(options.persistence?.enabled ? folder : undefined)
        this.settings      = new SettingsManager(db)
        this.rag           = new RAGManager(db, options.rag?.topK, options.rag?.minSimilarity)
        this.mcp           = new MCPManager(options.mcp?.servers)
        this.ragEnabled    = options.rag?.enabled ?? false
        this.mcpAutoInject = options.mcp?.autoInject ?? true

        // ── Router ────────────────────────────────────────────────────────────
        this.router = new ModelRouter(this.providers, options.routes, options.fallback)

        // ── Providers ─────────────────────────────────────────────────────────
        this._initProviders(options)

        // ── RAG embed function ─────────────────────────────────────────────────
        if (this.ragEnabled && options.rag?.embedModel) {
            const [provider, model] = options.rag.embedModel.split(':')
            const p = this.providers.get(provider)
            if (p && 'embed' in p) {
                this.rag.setEmbedFunction((text) => (p as OpenAICompatProvider).embed(text, model))
            }
        }
    }

    private _initProviders(options: ForgeAIOptions): void {
        const { providers: p } = options
        if (!p) return

        if (p.openai?.apiKey) {
            const { makeOpenAI } = require('./providers/OpenAICompatProvider')
            this.providers.register(makeOpenAI(p.openai.apiKey, p.openai.baseURL))
        }
        if (p.anthropic?.apiKey) {
            const { AnthropicProvider } = require('./providers/AnthropicProvider')
            this.providers.register(new AnthropicProvider(p.anthropic.apiKey))
        }
        if (p.gemini?.apiKey) {
            const { GeminiProvider } = require('./providers/GeminiProvider')
            this.providers.register(new GeminiProvider(p.gemini.apiKey))
        }
        if (p.ollama !== undefined) {
            const { makeOllama } = require('./providers/OpenAICompatProvider')
            this.providers.register(makeOllama(p.ollama.host))
        }
        if (p.deepseek?.apiKey) {
            const { makeDeepSeek } = require('./providers/OpenAICompatProvider')
            this.providers.register(makeDeepSeek(p.deepseek.apiKey))
        }
        if (p.openllm !== undefined) {
            const { makeOpenLLM } = require('./providers/OpenAICompatProvider')
            this.providers.register(makeOpenLLM(p.openllm.baseURL, p.openllm.apiKey))
        }
        if (p.kiwi?.apiKey) {
            const { makeKiwi } = require('./providers/OpenAICompatProvider')
            this.providers.register(makeKiwi(p.kiwi.apiKey, p.kiwi.baseURL))
        }
        for (const custom of p.custom ?? []) {
            const { OpenAICompatProvider: OAP } = require('./providers/OpenAICompatProvider')
            this.providers.register(new OAP({ id: custom.id, name: custom.name ?? custom.id, apiKey: custom.apiKey, baseURL: custom.baseURL }))
        }
    }

    // ─── Core chat ────────────────────────────────────────────────────────────

    /**
     * One-shot chat. No conversation history — just prompt → response.
     */
    async chat(
        prompt:  string,
        scope:   EngineScope = {},
        options: ChatOptions = {}
    ): Promise<ChatResult> {
        const model        = this._resolveModel(options.model, scope)
        const systemPrompt = this._resolveSystemPrompt(options.systemPrompt, scope)
        const messages     = this._buildMessages(prompt, [], systemPrompt, options, scope)

        const candidates = this.router.resolveModels(model, this.opts.defaultModel)
        const response   = await this.router.chatWithFallback(candidates, messages, {
            ...options,
            temperature: options.temperature ?? this.settings.resolve('temperature', this.opts.temperature, scope) ?? this.opts.temperature,
            maxTokens:   options.maxTokens   ?? this.settings.resolve('maxTokens',  this.opts.maxTokens,  scope)  ?? this.opts.maxTokens,
        })

        return {
            content:      response.content,
            model:        response.usedModel,
            convID:       null,
            inputTokens:  response.inputTokens,
            outputTokens: response.outputTokens,
        }
    }

    /**
     * Conversation-aware chat. Creates or continues a conversation by ID.
     * If no convID is given and autoCreate is true, creates one scoped to the provided scope.
     */
    async chatInConversation(
        prompt:     string,
        convID:     string | null,
        scope:      EngineScope = {},
        options:    ChatOptions = {},
        autoCreate  = true
    ): Promise<ChatResult> {
        let conv: Conversation | null = null

        if (convID) {
            conv = this.conversations.get(convID)
            if (!conv) throw new Error(`[ForgeAI] Conversation "${convID}" not found`)
        } else if (autoCreate) {
            const existing = this.conversations.findByScope(scope)
            conv = existing ?? this.conversations.create(scope)
        }

        if (!conv) throw new Error('[ForgeAI] No conversation ID and autoCreate is false')

        const model        = options.model ?? conv.model ?? this._resolveModel(undefined, scope)
        const systemPrompt = this._resolveSystemPrompt(options.systemPrompt ?? conv.systemPrompt ?? undefined, scope)
        const messages     = this._buildMessages(prompt, conv.messages, systemPrompt, options, scope)

        const maxHistory = conv.maxTokens ?? this.settings.resolve('maxHistory', this.opts.maxHistory, scope) ?? this.opts.maxHistory

        const candidates = this.router.resolveModels(model, this.opts.defaultModel)
        const response   = await this.router.chatWithFallback(candidates, messages, {
            ...options,
            temperature: options.temperature ?? conv.temperature ?? this.settings.resolve('temperature', this.opts.temperature, scope) ?? this.opts.temperature,
            maxTokens:   options.maxTokens   ?? conv.maxTokens  ?? this.settings.resolve('maxTokens',  this.opts.maxTokens,  scope)  ?? this.opts.maxTokens,
        })

        // Persist messages
        this.conversations.addMessage(conv.id, { role: 'user', content: prompt, timestamp: Date.now() }, maxHistory)
        this.conversations.addMessage(conv.id, {
            role: 'assistant', content: response.content,
            model: response.usedModel, timestamp: Date.now(),
            tokens: (response.inputTokens ?? 0) + (response.outputTokens ?? 0),
        }, maxHistory)

        return {
            content:      response.content,
            model:        response.usedModel,
            convID:       conv.id,
            inputTokens:  response.inputTokens,
            outputTokens: response.outputTokens,
        }
    }

    // ─── Message building ─────────────────────────────────────────────────────

    private async _buildMessages(
        prompt:  string,
        history: ChatMessage[],
        system:  string,
        options: ChatOptions,
        scope:   EngineScope
    ): Promise<ChatMessage[]> {
        const messages: ChatMessage[] = []

        // System prompt
        if (system) messages.push({ role: 'system', content: system, timestamp: 0 })

        // RAG injection
        if ((options.useRAG ?? this.ragEnabled) && this.ragEnabled) {
            const results = await this.rag.search(prompt, options.ragNamespace)
            if (results.length) {
                const context = RAGManager.formatContext(results)
                // Prepend context to the system message or add as separate user turn
                if (messages.length && messages[0].role === 'system') {
                    messages[0] = { ...messages[0], content: messages[0].content + '\n\n' + context }
                } else {
                    messages.push({ role: 'system', content: context, timestamp: 0 })
                }
            }
        }

        // History
        messages.push(...history.filter(m => m.role !== 'system'))

        // Current prompt
        messages.push({ role: 'user', content: prompt, timestamp: Date.now() })

        return messages
    }

    // ─── Resolution helpers ───────────────────────────────────────────────────

    private _resolveModel(override: ModelString | undefined, scope: EngineScope): ModelString {
        if (override) return override
        return this.settings.resolve('model', this.opts.defaultModel, scope) ?? this.opts.defaultModel
    }

    private _resolveSystemPrompt(override: string | undefined, scope: EngineScope): string {
        if (this.opts.systemPromptMode === 'append') {
            const parts: string[] = []
            if (this.opts.defaultSystemPrompt) parts.push(this.opts.defaultSystemPrompt)

            if (scope.guildID) {
                const gs = this.settings.getGuild(scope.guildID)
                if (gs.systemPrompt) parts.push(gs.systemPrompt)
                if (scope.channelID && gs.channelConfig[scope.channelID]?.systemPrompt) {
                    parts.push(gs.channelConfig[scope.channelID].systemPrompt!)
                }
            }
            if (scope.userID) {
                const us = this.settings.getUser(scope.userID)
                if (us.systemPrompt) parts.push(us.systemPrompt)
            }
            if (override) parts.push(override)
            return parts.join('\n\n')
        }

        // replace mode: most specific wins
        if (override) return override
        const resolved = this.settings.resolve('systemPrompt', this.opts.defaultSystemPrompt, scope)
        return resolved ?? this.opts.defaultSystemPrompt
    }
}
