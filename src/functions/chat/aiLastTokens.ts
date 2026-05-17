import { ArgType, NativeFunction } from '@tryforge/forgescript';

export default new NativeFunction({
  name: '$aiLastTokens',
  description:
    'Returns the total tokens used in the most recent AI call (input + output). Returns 0 if not tracked.',
  version: '1.0.0',
  output: ArgType.Number,
  unwrap: false,
  execute(ctx) {
    const tokens = (ctx as any).environment?.['_ai_last_tokens'] as
      | number
      | undefined;
    return this.success(String(tokens ?? 0));
  },
});
