import { ArgType, NativeFunction } from '@tryforge/forgescript'

// We store last-call metadata in ctx.environment so it's per-execution
// and doesn't need a separate store.

export const aiLastModel = new NativeFunction({
    name: '$aiLastModel',
    description: 'Returns the model that was actually used in the most recent $aiChat or $aiChatRaw call in this execution.',
    version: '1.0.0',
    output: ArgType.String,
    execute(ctx) {
        const model = (ctx as any).environment?.['_ai_last_model'] as string | undefined
        return this.success(model ?? '')
    },
})

export const aiLastTokens = new NativeFunction({
    name: '$aiLastTokens',
    description: 'Returns the total tokens used in the most recent AI call (input + output). Returns 0 if not tracked.',
    version: '1.0.0',
    output: ArgType.Number,
    execute(ctx) {
        const tokens = (ctx as any).environment?.['_ai_last_tokens'] as number | undefined
        return this.success(String(tokens ?? 0))
    },
})

export const aiLastConvId = new NativeFunction({
    name: '$aiLastConvId',
    description: 'Returns the conversation ID used in the most recent $aiChat call.',
    version: '1.0.0',
    output: ArgType.String,
    execute(ctx) {
        const id = (ctx as any).environment?.['_ai_last_conv_id'] as string | undefined
        return this.success(id ?? '')
    },
})

export default [aiLastModel, aiLastTokens, aiLastConvId]
