import { ArgType, NativeFunction } from '@tryforge/forgescript';

export default new NativeFunction({
  name: '$aiLastConvId',
  description:
    'Returns the conversation ID used in the most recent $aiChat call.',
  version: '1.0.0',
  output: ArgType.String,
  unwrap: false,
  execute(ctx) {
    const id = (ctx as any).environment?.['_ai_last_conv_id'] as
      | string
      | undefined;
    return this.success(id ?? '');
  },
});
