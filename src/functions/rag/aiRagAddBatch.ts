import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagAddBatch',
  description: 'Add multiple documents at once separated by a delimiter.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'content',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'All documents joined by separator.',
    },
    {
      name: 'separator',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Separator between documents. Default: newline.',
    },
    {
      name: 'namespace',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Namespace to add documents to. Default: "default".'
    },
  ],
  output: ArgType.Number,
  async execute(ctx, [content, separator, namespace]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const items = content
      .split(separator ?? '\n')
      .map((c) => c.trim())
      .filter(Boolean);
    const count = await ext.engine.rag.addBatch(
      items.map((c) => ({ content: c, namespace: namespace ?? 'default' })),
    );
    return this.success(String(count));
  },
});
