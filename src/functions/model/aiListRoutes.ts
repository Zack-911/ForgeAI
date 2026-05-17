import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiListRoutes',
  description: 'Returns all named routes as JSON.',
  version: '1.0.0',
  output: ArgType.Json,
  unwrap: false,
  execute(ctx) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(JSON.stringify(ext.engine.router.listRoutes()));
  },
});
