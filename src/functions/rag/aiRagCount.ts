import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagCount',
  description:
    'Returns the number of documents in the RAG store, optionally filtered by namespace.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'namespace',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Namespace to count documents in. Default: "default".'
    },
  ],
  output: ArgType.Number,
  async execute(ctx, [namespace]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(
      String(await ext.engine.rag.count(namespace ?? undefined)),
    );
  },
});
