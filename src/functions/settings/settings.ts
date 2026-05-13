import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { ForgeAI } from '../..'

// ── User settings ─────────────────────────────────────────────────────────────

export const aiSetUserModel = new NativeFunction({
    name: '$aiSetUserModel',
    description: 'Set the default AI model for a user.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'model',  type: ArgType.String, required: true,  rest: false },
        { name: 'userId', type: ArgType.String, required: false, rest: false, description: 'Defaults to command author.' },
    ],
    execute(ctx, [model, userId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchUser(userId ?? ctx.user!.id, { model })
        return this.success()
    },
})

export const aiSetUserSystemPrompt = new NativeFunction({
    name: '$aiSetUserSystemPrompt',
    description: 'Set a custom system prompt for a user.',
    version: '1.0.0', brackets: true, unwrap: false,
    args: [
        { name: 'prompt', type: ArgType.String, required: true,  rest: false },
        { name: 'userId', type: ArgType.String, required: false, rest: false },
    ],
    async execute(ctx) {
        const prompt = this['displayField'](0) ?? ''
        const uidR   = await this['resolveUnhandledArg'](ctx, 1)
        if (!this['isValidReturnType'](uidR)) return uidR
        const uid    = (uidR.value as string | null) ?? ctx.user?.id
        if (!uid) return this.customError('No user ID.')
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchUser(uid, { systemPrompt: prompt })
        return this.success()
    },
})

export const aiSetUserTemperature = new NativeFunction({
    name: '$aiSetUserTemperature',
    description: 'Set the default temperature (0–2) for a user.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'temperature', type: ArgType.Number, required: true,  rest: false },
        { name: 'userId',      type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [temperature, userId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchUser(userId ?? ctx.user!.id, { temperature })
        return this.success()
    },
})

export const aiSetUserMaxHistory = new NativeFunction({
    name: '$aiSetUserMaxHistory',
    description: 'Set the max conversation history length for a user.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'maxHistory', type: ArgType.Number, required: true,  rest: false },
        { name: 'userId',     type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [maxHistory, userId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchUser(userId ?? ctx.user!.id, { maxHistory })
        return this.success()
    },
})

export const aiSetUserMaxTokens = new NativeFunction({
    name: '$aiSetUserMaxTokens',
    description: 'Set the max tokens for a user.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'maxTokens', type: ArgType.Number, required: true,  rest: false },
        { name: 'userId',    type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [maxTokens, userId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchUser(userId ?? ctx.user!.id, { maxTokens })
        return this.success()
    },
})

export const aiResetUserSettings = new NativeFunction({
    name: '$aiResetUserSettings',
    description: 'Reset all AI settings for a user to defaults.',
    version: '1.0.0', brackets: false, unwrap: true,
    args: [{ name: 'userId', type: ArgType.String, required: false, rest: false }],
    execute(ctx, [userId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.resetUser(userId ?? ctx.user!.id)
        return this.success()
    },
})

export const aiGetUserSetting = new NativeFunction({
    name: '$aiGetUserSetting',
    description: 'Get a user AI setting. Keys: model, systemPrompt, temperature, maxHistory, maxTokens',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'key',    type: ArgType.String, required: true,  rest: false },
        { name: 'userId', type: ArgType.String, required: false, rest: false },
    ],
    output: ArgType.String,
    execute(ctx, [key, userId]) {
        const s = ctx.client.getExtension(ForgeAI, true).engine.settings.getUser(userId ?? ctx.user!.id)
        return this.success(String((s as any)[key] ?? ''))
    },
})

// ── Guild settings ────────────────────────────────────────────────────────────

export const aiSetGuildModel = new NativeFunction({
    name: '$aiSetGuildModel',
    description: 'Set the default AI model for the guild.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'model',   type: ArgType.String, required: true,  rest: false },
        { name: 'guildId', type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [model, guildId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchGuild(guildId ?? ctx.guild!.id, { model })
        return this.success()
    },
})

export const aiSetGuildSystemPrompt = new NativeFunction({
    name: '$aiSetGuildSystemPrompt',
    description: 'Set the default system prompt for the guild.',
    version: '1.0.0', brackets: true, unwrap: false,
    args: [
        { name: 'prompt',  type: ArgType.String, required: true,  rest: false },
        { name: 'guildId', type: ArgType.String, required: false, rest: false },
    ],
    async execute(ctx) {
        const prompt = this['displayField'](0) ?? ''
        const gidR   = await this['resolveUnhandledArg'](ctx, 1)
        if (!this['isValidReturnType'](gidR)) return gidR
        const gid    = (gidR.value as string | null) ?? ctx.guild?.id
        if (!gid) return this.customError('No guild ID.')
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchGuild(gid, { systemPrompt: prompt })
        return this.success()
    },
})

export const aiSetGuildMaxHistory = new NativeFunction({
    name: '$aiSetGuildMaxHistory',
    description: 'Set the max conversation history length for the guild.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'maxHistory', type: ArgType.Number, required: true,  rest: false },
        { name: 'guildId',    type: ArgType.String, required: false, rest: false },
    ],
    execute(ctx, [maxHistory, guildId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.patchGuild(guildId ?? ctx.guild!.id, { maxHistory })
        return this.success()
    },
})

export const aiResetGuildSettings = new NativeFunction({
    name: '$aiResetGuildSettings',
    description: 'Reset all AI settings for the guild.',
    version: '1.0.0', brackets: false, unwrap: true,
    args: [{ name: 'guildId', type: ArgType.String, required: false, rest: false }],
    execute(ctx, [guildId]) {
        ctx.client.getExtension(ForgeAI, true).engine.settings.resetGuild(guildId ?? ctx.guild!.id)
        return this.success()
    },
})

// ── Channel settings ──────────────────────────────────────────────────────────

export const aiSetChannelModel = new NativeFunction({
    name: '$aiSetChannelModel',
    description: 'Set the AI model for a specific channel.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'model',     type: ArgType.String,      required: true,  rest: false },
        { name: 'channelId', type: ArgType.TextChannel, required: false, rest: false },
        { name: 'guildId',   type: ArgType.String,      required: false, rest: false },
    ],
    execute(ctx, [model, channel, guildId]) {
        const gid = guildId ?? ctx.guild?.id
        const cid = channel?.id ?? ctx.channel?.id
        if (!gid || !cid) return this.customError('No guild or channel ID.')
        ctx.client.getExtension(ForgeAI, true).engine.settings.setChannelConfig(gid, cid, { model })
        return this.success()
    },
})

export const aiSetChannelSystemPrompt = new NativeFunction({
    name: '$aiSetChannelSystemPrompt',
    description: 'Set the system prompt for a specific channel.',
    version: '1.0.0', brackets: true, unwrap: false,
    args: [
        { name: 'prompt',    type: ArgType.String, required: true,  rest: false },
        { name: 'channelId', type: ArgType.String, required: false, rest: false },
        { name: 'guildId',   type: ArgType.String, required: false, rest: false },
    ],
    async execute(ctx) {
        const prompt = this['displayField'](0) ?? ''
        const cidR   = await this['resolveUnhandledArg'](ctx, 1)
        const gidR   = await this['resolveUnhandledArg'](ctx, 2)
        if (!this['isValidReturnType'](cidR)) return cidR
        if (!this['isValidReturnType'](gidR)) return gidR
        const cid = (cidR.value as string | null) ?? ctx.channel?.id
        const gid = (gidR.value as string | null) ?? ctx.guild?.id
        if (!gid || !cid) return this.customError('No guild or channel ID.')
        ctx.client.getExtension(ForgeAI, true).engine.settings.setChannelConfig(gid, cid, { systemPrompt: prompt })
        return this.success()
    },
})

export const aiSetChannelEnabled = new NativeFunction({
    name: '$aiSetChannelEnabled',
    description: 'Enable or disable AI responses in a specific channel.',
    version: '1.0.0', brackets: true, unwrap: true,
    args: [
        { name: 'enabled',   type: ArgType.Boolean,     required: true,  rest: false },
        { name: 'channelId', type: ArgType.TextChannel, required: false, rest: false },
        { name: 'guildId',   type: ArgType.String,      required: false, rest: false },
    ],
    execute(ctx, [enabled, channel, guildId]) {
        const gid = guildId ?? ctx.guild?.id
        const cid = channel?.id ?? ctx.channel?.id
        if (!gid || !cid) return this.customError('No guild or channel ID.')
        ctx.client.getExtension(ForgeAI, true).engine.settings.setChannelConfig(gid, cid, { enabled })
        return this.success()
    },
})

export default [
    aiSetUserModel, aiSetUserSystemPrompt, aiSetUserTemperature,
    aiSetUserMaxHistory, aiSetUserMaxTokens, aiResetUserSettings, aiGetUserSetting,
    aiSetGuildModel, aiSetGuildSystemPrompt, aiSetGuildMaxHistory, aiResetGuildSettings,
    aiSetChannelModel, aiSetChannelSystemPrompt, aiSetChannelEnabled,
]
