import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagAdd',
  description: 'Add a document to the local RAG store.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'content',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The document content.',
    },
    {
      name: 'namespace',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Namespace to group documents. Default: "default".',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [content, namespace]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const doc = await ext.engine.rag.add(content, namespace ?? 'default');
    return this.success(doc.id);
  },
});
