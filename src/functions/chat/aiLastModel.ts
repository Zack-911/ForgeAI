import { ArgType, NativeFunction } from '@tryforge/forgescript';

export default new NativeFunction({
  name: '$aiLastModel',
  description:
    'Returns the model that was actually used in the most recent $aiChat or $aiChatRaw call in this execution.',
  version: '1.0.0',
  output: ArgType.String,
  unwrap: false,
  execute(ctx) {
    const model = (ctx as any).environment?.['_ai_last_model'] as
      | string
      | undefined;
    return this.success(model ?? '');
  },
});
