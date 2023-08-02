import { Router } from 'express';

import { createRouter } from '@janus-idp/backstage-plugin-kiali-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  return await createRouter({
    logger: env.logger,
    config: env.config,
    catalogApi
  });
}
