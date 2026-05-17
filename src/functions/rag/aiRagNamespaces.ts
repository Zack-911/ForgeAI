import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagNamespaces',
  description: 'Returns all RAG namespaces joined by separator.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'separator',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Separator for joining namespace IDs. Default: ", "'
    },
  ],
  output: ArgType.String,
  async execute(ctx, [separator]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(
      (await ext.engine.rag.listNamespaces()).join(separator ?? ', '),
    );
  },
});
