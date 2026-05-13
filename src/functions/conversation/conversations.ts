import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { ForgeAI } from '../..'

export const aiNewConversation = new NativeFunction({
    name: '$aiNewConversation',
    aliases: ['$aiCreateConversation'],
    description: 'Creates a new conversation and returns its ID.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        { name: 'userId',    type: ArgType.String, required: false, rest: false, description: 'Scope the conversation to a user. Defaults to command author.' },
        { name: 'guildId',   type: ArgType.String, required: false, rest: false, description: 'Scope the conversation to a guild. Defaults to current guild.' },
        { name: 'channelId', type: ArgType.String, required: false, rest: false, description: 'Scope the conversation to a channel. Defaults to current channel.' },
    ],
    output: ArgType.String,
    execute(ctx, [userId, guildId, channelId]) {
        const ext  = ctx.client.getExtension(ForgeAI, true)
        const conv = ext.engine.conversations.create({
            userID:    userId    ?? ctx.user?.id,
            guildID:   guildId   ?? ctx.guild?.id,
            channelID: channelId ?? ctx.channel?.id,
        })
        return this.success(conv.id)
    },
})

export const aiDeleteConversation = new NativeFunction({
    name: '$aiDeleteConversation',
    description: 'Deletes a conversation and all its history.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'convId', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [convId]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(String(ext.engine.conversations.delete(convId)))
    },
})

export const aiClearConversation = new NativeFunction({
    name: '$aiClearConversation',
    description: 'Clears all messages in a conversation, keeping its settings.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'convId', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [convId]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(String(ext.engine.conversations.clear(convId)))
    },
})

export const aiGetConvId = new NativeFunction({
    name: '$aiGetConvId',
    description: 'Finds the most recent conversation for the given scope (user/guild/channel). Returns empty if none found.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        { name: 'userId',    type: ArgType.String, required: false, rest: false },
        { name: 'guildId',   type: ArgType.String, required: false, rest: false },
        { name: 'channelId', type: ArgType.String, required: false, rest: false },
    ],
    output: ArgType.String,
    execute(ctx, [userId, guildId, channelId]) {
        const ext  = ctx.client.getExtension(ForgeAI, true)
        const conv = ext.engine.conversations.findByScope({
            userID:    userId    ?? ctx.user?.id,
            guildID:   guildId   ?? ctx.guild?.id,
            channelID: channelId ?? ctx.channel?.id,
        })
        return this.success(conv?.id ?? '')
    },
})

export const aiConvInfo = new NativeFunction({
    name: '$aiConvInfo',
    description: 'Returns a property of a conversation as a string. Properties: id, userID, guildID, channelID, model, systemPrompt, temperature, maxTokens, messageCount, createdAt, updatedAt',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'convId',   type: ArgType.String, required: true,  rest: false },
        { name: 'property', type: ArgType.String, required: true,  rest: false },
    ],
    output: ArgType.String,
    execute(ctx, [convId, property]) {
        const ext  = ctx.client.getExtension(ForgeAI, true)
        const conv = ext.engine.conversations.get(convId)
        if (!conv) return this.customError(`Conversation "${convId}" not found.`)
        const map: Record<string, string> = {
            id:           conv.id,
            userID:       conv.userID    ?? '',
            guildID:      conv.guildID   ?? '',
            channelID:    conv.channelID ?? '',
            model:        conv.model     ?? '',
            systemPrompt: conv.systemPrompt ?? '',
            temperature:  String(conv.temperature ?? ''),
            maxTokens:    String(conv.maxTokens   ?? ''),
            messageCount: String(conv.messages.filter(m => m.role !== 'system').length),
            createdAt:    String(conv.createdAt),
            updatedAt:    String(conv.updatedAt),
        }
        return this.success(map[property] ?? '')
    },
})

export const aiConvHistory = new NativeFunction({
    name: '$aiConvHistory',
    description: 'Returns the conversation history. format: "json" returns raw JSON, "text" returns a readable transcript.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'convId', type: ArgType.String, required: true,  rest: false },
        { name: 'format', type: ArgType.String, required: false, rest: false, description: 'json or text. Default: json' },
    ],
    output: ArgType.String,
    execute(ctx, [convId, format]) {
        const ext  = ctx.client.getExtension(ForgeAI, true)
        const conv = ext.engine.conversations.get(convId)
        if (!conv) return this.customError(`Conversation "${convId}" not found.`)
        const msgs = conv.messages.filter(m => m.role !== 'system')
        if ((format ?? 'json') === 'text') {
            const text = msgs.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n')
            return this.success(text)
        }
        return this.success(JSON.stringify(msgs))
    },
})

export const aiSetConvModel = new NativeFunction({
    name: '$aiSetConvModel',
    description: 'Sets the model for a specific conversation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'convId', type: ArgType.String, required: true,  rest: false },
        { name: 'model',  type: ArgType.String, required: true,  rest: false },
    ],
    execute(ctx, [convId, model]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        const res = ext.engine.conversations.update(convId, { model })
        if (!res) return this.customError(`Conversation "${convId}" not found.`)
        return this.success()
    },
})

export const aiSetConvSystemPrompt = new NativeFunction({
    name: '$aiSetConvSystemPrompt',
    description: 'Sets the system prompt for a specific conversation.',
    version: '1.0.0',
    brackets: true,
    unwrap: false,
    args: [
        { name: 'convId',       type: ArgType.String, required: true,  rest: false },
        { name: 'systemPrompt', type: ArgType.String, required: true,  rest: false },
    ],
    async execute(ctx) {
        const convIdResult = await this['resolveUnhandledArg'](ctx, 0)
        if (!this['isValidReturnType'](convIdResult)) return convIdResult
        const prompt = this['displayField'](1) ?? ''
        const ext    = ctx.client.getExtension(ForgeAI, true)
        const res    = ext.engine.conversations.update(convIdResult.value as string, { systemPrompt: prompt })
        if (!res) return this.customError(`Conversation "${convIdResult.value}" not found.`)
        return this.success()
    },
})

export const aiSetConvTemperature = new NativeFunction({
    name: '$aiSetConvTemperature',
    description: 'Sets the temperature (0–2) for a specific conversation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'convId',      type: ArgType.String, required: true, rest: false },
        { name: 'temperature', type: ArgType.Number, required: true, rest: false },
    ],
    execute(ctx, [convId, temperature]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        ext.engine.conversations.update(convId, { temperature })
        return this.success()
    },
})

export const aiDeleteAllConversations = new NativeFunction({
    name: '$aiDeleteAllConversations',
    description: 'Deletes all conversations for a user, guild, or both.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        { name: 'userId',  type: ArgType.String, required: false, rest: false },
        { name: 'guildId', type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [userId, guildId]) {
        const ext   = ctx.client.getExtension(ForgeAI, true)
        const count = ext.engine.conversations.deleteByScope({
            userID:  userId  ?? ctx.user?.id,
            guildID: guildId ?? ctx.guild?.id,
        })
        return this.success(String(count))
    },
})

export default [
    aiNewConversation, aiDeleteConversation, aiClearConversation,
    aiGetConvId, aiConvInfo, aiConvHistory,
    aiSetConvModel, aiSetConvSystemPrompt, aiSetConvTemperature,
    aiDeleteAllConversations,
]
