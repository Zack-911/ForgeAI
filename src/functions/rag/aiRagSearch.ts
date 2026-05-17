import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagSearch',
  description:
    'Search the RAG store and return matching document contents joined by separator.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'query',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The query to search for.',
    },
    {
      name: 'namespace',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The namespace to search in.',
    },
    {
      name: 'topK',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The number of results to return. Default: 5.',
    },
    {
      name: 'separator',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Default: \\n---\\n',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [query, namespace, topK, separator]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const results = await ext.engine.rag.search(
      query,
      namespace ?? undefined,
      topK ?? undefined,
    );
    const sep = separator ?? '\n---\n';
    return this.success(results.map((r) => r.document.content).join(sep));
  },
});
